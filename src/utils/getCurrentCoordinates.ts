export function getCurrentCoordinates() {
    const match = document.location.href.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    return match ? [match[1], match[2]].join(',') : '';
}
