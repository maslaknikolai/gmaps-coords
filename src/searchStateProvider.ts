export function createSearchStateProvider() {
    let isDestroyed = false

    const trigger = document.getElementById('omnibox-singlebox');

    const changeListeners = new Set<(isSearchInProgress: boolean) => void>()
    const onSearchStartListeners = new Set<() => void>()
    const onSearchEndListeners = new Set<() => void>()

    const notify = (newIsSearchInProgress: boolean) => {
        changeListeners.forEach(listener => listener(newIsSearchInProgress))

        if (newIsSearchInProgress) {
            onSearchStartListeners.forEach(listener => listener())
        } else {
            onSearchEndListeners.forEach(listener => listener())
        }
    }

    let isSearchInProgress = !!trigger.className
    notify(isSearchInProgress)

    const interval = setInterval(() => {
        const newIsSearchInProgress = !!trigger.className
        if (isSearchInProgress === newIsSearchInProgress) return;
        isSearchInProgress = newIsSearchInProgress
        notify(isSearchInProgress)
    }, 100)

    const assertNotDestroyed = () => {
        if (isDestroyed) {
            throw new Error('SearchStateProvider is destroyed')
        }
    }

    return {
        destroy: () => {
            clearInterval(interval)
            isDestroyed = true
        },
        onChange: (listener: (isSearchInProgress: boolean) => void) => {
            assertNotDestroyed()
            changeListeners.add(listener)
            return () => changeListeners.delete(listener)
        },
        onSearchStart: () => new Promise<void>(resolve => {
            assertNotDestroyed()
            if (isSearchInProgress) {
                resolve()
                return
            }
            onSearchStartListeners.add(resolve)
        }),
        onSearchEnd: () => new Promise<void>(resolve => {
            assertNotDestroyed()
            if (!isSearchInProgress) {
                resolve()
                return
            }
            onSearchEndListeners.add(resolve)
        })
    }
}
