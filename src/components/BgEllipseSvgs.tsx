import React from "react";

const BgEllipseSvgs = () => {
	return (
		<div className="absolute top-0 pointer-events-none w-screen h-screen overflow-hidden flex items-center">
			<div className="absolute -top-[300px] -left-[400px] w-[745px] h-[745px] bg-[rgba(99,57,249,0.15)] rounded-full blur-[200px]"></div>
			<div className="absolute -bottom-[500px] left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-[rgba(20,241,149,0.24)] rounded-full blur-[200px]"></div>
		</div>
	);
};

export default BgEllipseSvgs;
