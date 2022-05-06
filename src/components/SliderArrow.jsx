function SliderArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} slider-arrow`}
            style={{ ...style }}
            onClick={onClick}
        />
    );
}

export default SliderArrow;