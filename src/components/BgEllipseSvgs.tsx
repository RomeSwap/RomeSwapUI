import Image from "next/image";

const BgEllipseSvgs = () => {
	return (
		<>
			<div className="absolute -top-[540px] -left-[544px]">
				<Image
					src={"/ellipse-purple.png"}
					width={1440}
					height={1440}
					alt="Ellipse"
				/>
			</div>
			<div className="absolute -bottom-[640px] left-[144px]">
				<Image
					src={"/ellipse-green.png"}
					width={1440}
					height={1440}
					alt="Ellipse"
				/>
			</div>
		</>
	);
};

export default BgEllipseSvgs;
