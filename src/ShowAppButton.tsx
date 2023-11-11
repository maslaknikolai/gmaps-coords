import classNames from 'classnames';
import ChevronUpIcon from 'mdi-react/ChevronUpIcon';

export const ShowAppButton = ({
    onClick,
    isAppShown,
}: {
    onClick: () => void,
    isAppShown: boolean,
}) => {

	return (
        <button
            onClick={onClick}
            className={classNames([
                'absolute top-[-27px] left-[50%] -translate-x-1 cursor-pointer bg-black rounded-sm',
            ])}
        >
            <ChevronUpIcon className={classNames([
                'transition-all duration-1000',
                {
                'transform rotate-180': isAppShown,
                }
            ])} />
        </button>
	);
}
