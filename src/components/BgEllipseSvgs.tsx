import React from "react";

const BgEllipseSvgs = () => {
	return (
		<div className="absolute top-0 pointer-events-none w-screen h-full flex items-center justify-center">
			{/* Top */}
			<div className="hidden lg:block absolute -top-[600px] left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-[rgba(20,241,149,0.24)] rounded-full blur-[200px]"></div>
			{/* Right */}
			<div className="absolute -bottom-[150px] lg:-bottom-[300px] -right-0 w-[200px] lg:w-[300px] h-[400px] lg:h-[600px] bg-[rgba(20,241,149,0.24)] rounded-l-full blur-[100px] lg:blur-[200px]"></div>
		</div>
	);
};

export default BgEllipseSvgs;
