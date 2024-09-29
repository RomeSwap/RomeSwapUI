const walletTruncatizer = (addr: string) => {
	if (addr.length == 42) {
		return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
	} else if (addr.length < 42) {
		return `Are you sure "${addr}" is a valid EVM wallet address?`;
	}
	return addr;
};

export default walletTruncatizer;
