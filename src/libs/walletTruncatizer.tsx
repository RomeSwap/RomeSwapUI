const walletTruncatizer = (addr: string) => {
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
};

export default walletTruncatizer;
