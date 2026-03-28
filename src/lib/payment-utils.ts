/**
 * 付款相關工具函式
 */

/**
 * 在新視窗開啟 ECPay 付款表單
 * @returns true 表示成功開啟，false 表示被瀏覽器阻擋
 */
export function openPaymentWindow(html: string): boolean {
  const paymentWindow = window.open('', '_blank');
  if (!paymentWindow) return false;

  paymentWindow.document.write(html);
  paymentWindow.document.close();
  return true;
}
