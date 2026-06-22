class OrderPage {
  constructor(page) {
    this.page = page;
    this.orderPanel = page.getByRole('heading', { name: '2. 一般訂貨' });
    this.storeSelect = page.getByLabel('門市');
    this.orderDateInput = page.getByLabel('訂貨日');
    this.submitButton = page.getByRole('button', { name: '送出訂貨' });
    this.summaryCount = page.locator('#summary-count');
    this.summaryTotal = page.locator('#summary-total');
    this.orderStatus = page.locator('#order-status');
  }

  async setOrderHeader(order) {
    await this.storeSelect.selectOption(order.store);
    await this.orderDateInput.fill(order.orderDate);
  }

  async addItem(item) {
    await this.page.getByLabel(`${item.name} 訂貨量`).fill(String(item.quantity));
    await this.page.getByRole('button', { name: `加入 ${item.name}` }).click();
  }

  async addItems(items) {
    for (const item of items) {
      await this.addItem(item);
    }
  }

  async submitOrder() {
    await this.submitButton.click();
  }
}

module.exports = { OrderPage };
