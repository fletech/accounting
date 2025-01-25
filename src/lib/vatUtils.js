export function calculateVAT(totalWithVAT, vatRate) {
  const net = totalWithVAT / (1 + vatRate / 100);
  const vat = totalWithVAT - net;
  return {
    net: Number(net.toFixed(2)),
    vat: Number(vat.toFixed(2)),
    total: totalWithVAT,
  };
}
