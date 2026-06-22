const demoItems = [
  { id: 'ITEM-001', name: '冰美式咖啡', kind: '一般商品', sugM: 8 },
  { id: 'ITEM-002', name: '鮪魚飯糰', kind: '一般商品', sugM: 12 },
  { id: 'ITEM-003', name: '季節限定甜點', kind: '選擇型商品', sugM: 4 }
];

const state = {
  loggedIn: false,
  orderLines: []
};

const $ = (selector) => document.querySelector(selector);

function renderItems() {
  const table = $('#item-table');
  table.innerHTML = '';

  demoItems.forEach((item) => {
    const row = document.createElement('tr');
    row.dataset.itemId = item.id;
    row.innerHTML = `
      <td>${item.name}<br><small>${item.id}</small></td>
      <td>${item.kind}</td>
      <td>${item.sugM}</td>
      <td>
        <input class="quantity-input" aria-label="${item.name} 訂貨量" type="number" min="0" value="${item.sugM}" />
      </td>
      <td><button class="secondary add-line" type="button" aria-label="加入 ${item.name}">加入</button></td>
    `;
    table.appendChild(row);
  });
}

function updateSummary() {
  const count = state.orderLines.length;
  const total = state.orderLines.reduce((sum, line) => sum + line.quantity, 0);
  $('#summary-count').textContent = String(count);
  $('#summary-total').textContent = String(total);
}

function showStatus(selector, message, type = 'muted') {
  const el = $(selector);
  el.textContent = message;
  el.className = `status ${type}`;
}

$('#login-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const userId = $('#user-id').value.trim();
  const password = $('#password').value.trim();

  if (userId === 'qa.demo' && password === 'demo1234') {
    state.loggedIn = true;
    $('#order-panel').classList.remove('hidden');
    showStatus('#login-status', '登入成功：已進入一般訂貨流程', 'success');
    renderItems();
    return;
  }

  showStatus('#login-status', '登入失敗：請確認帳號與密碼', 'error');
});

$('#item-table').addEventListener('click', (event) => {
  if (!event.target.matches('.add-line')) return;

  const row = event.target.closest('tr');
  const item = demoItems.find((entry) => entry.id === row.dataset.itemId);
  const quantity = Number(row.querySelector('.quantity-input').value);

  if (!Number.isInteger(quantity) || quantity < 0) {
    showStatus('#order-status', '訂貨量不可為負數或非整數', 'error');
    return;
  }

  const existingLine = state.orderLines.find((line) => line.id === item.id);
  if (existingLine) {
    existingLine.quantity = quantity;
  } else {
    state.orderLines.push({ id: item.id, name: item.name, quantity });
  }

  updateSummary();
  showStatus('#order-status', `已加入：${item.name}，訂貨量 ${quantity}`, 'success');
});

$('#submit-order').addEventListener('click', () => {
  if (!state.loggedIn) {
    showStatus('#order-status', '請先登入後再送出訂貨', 'error');
    return;
  }

  if (state.orderLines.length === 0) {
    showStatus('#order-status', '請至少加入一筆訂貨商品', 'error');
    return;
  }

  const store = $('#store-select').value;
  const orderDate = $('#order-date').value;
  const total = state.orderLines.reduce((sum, line) => sum + line.quantity, 0);
  const orderNo = `${store}-${orderDate.replaceAll('-', '')}-${String(total).padStart(3, '0')}`;
  showStatus('#order-status', `訂貨成功：單號 ${orderNo}`, 'success');
});
