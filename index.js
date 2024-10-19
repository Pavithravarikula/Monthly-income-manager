let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let totalIncome = 0;
let totalExpenses = 0;
let monthlyIncomeTarget = parseFloat(localStorage.getItem('monthlyIncomeTarget')) || 0;
let monthlyExpenseTarget = parseFloat(localStorage.getItem('monthlyExpenseTarget')) || 0;

const typeSelect = document.getElementById('type');
const categoryInput = document.getElementById('category');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const addBtn = document.getElementById('add-btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalIncomeCell = document.getElementById('total-income');
const totalExpensesCell = document.getElementById('total-expenses');
const savingsCell = document.getElementById('savings');
const incomeTargetInput = document.getElementById('income-target');
const expenseTargetInput = document.getElementById('expense-target');
const setTargetsBtn = document.getElementById('set-targets-btn');
const expenseChartCtx = document.getElementById('expenseChart').getContext('2d');

let chart;


addBtn.addEventListener('click', function(event) {
    event.preventDefault();

    const type = typeSelect.value;
    const category = categoryInput.value;
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;


    if (!category || isNaN(amount) || amount <= 0 || !date) {
        alert('Please fill all fields correctly.');
        return;
    }


    const expense = {
        type,
        category,
        amount,
        date
    };
    expenses.push(expense);


    localStorage.setItem('expenses', JSON.stringify(expenses));


    updateDisplay();
    updateChart();
});


setTargetsBtn.addEventListener('click', function() {
    monthlyIncomeTarget = parseFloat(incomeTargetInput.value);
    monthlyExpenseTarget = parseFloat(expenseTargetInput.value);

    if (isNaN(monthlyIncomeTarget) || isNaN(monthlyExpenseTarget) || monthlyIncomeTarget <= 0 || monthlyExpenseTarget <= 0) {
        alert('Please enter valid targets.');
        return;
    }


    localStorage.setItem('monthlyIncomeTarget', monthlyIncomeTarget);
    localStorage.setItem('monthlyExpenseTarget', monthlyExpenseTarget);

    updateDisplay();
});


function updateDisplay() {

    totalIncome = expenses.filter(entry => entry.type === 'income')
        .reduce((sum, entry) => sum + entry.amount, 0);
    totalExpenses = expenses.filter(entry => entry.type === 'expense')
        .reduce((sum, entry) => sum + entry.amount, 0);


    totalIncomeCell.textContent = `$${totalIncome.toFixed(2)}`;
    totalExpensesCell.textContent = `$${totalExpenses.toFixed(2)}`;
    const savings = totalIncome - totalExpenses;
    savingsCell.textContent = `$${savings.toFixed(2)}`;


    if (totalExpenses > totalIncome) {
        alert('Warning: Your total expenses exceed your income!');
    }
    if (totalExpenses > monthlyExpenseTarget) {
        alert('Warning: Your expenses have exceeded the monthly target!');
    }

    renderEntries();
}


function renderEntries() {
    expenseTableBody.innerHTML = '';

    expenses.forEach((expense, index) => {
        const newRow = expenseTableBody.insertRow();

        const typeCell = newRow.insertCell();
        const categoryCell = newRow.insertCell();
        const amountCell = newRow.insertCell();
        const dateCell = newRow.insertCell();
        const deleteCell = newRow.insertCell();


        typeCell.textContent = expense.type;
        categoryCell.textContent = expense.category;
        amountCell.textContent = `$${expense.amount}`;
        dateCell.textContent = expense.date;


        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteCell.appendChild(deleteBtn);


        deleteBtn.addEventListener('click', function() {
            expenses.splice(index, 1);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            updateDisplay();
            updateChart();
        });
    });
}


function updateChart() {
    const categories = {};

    expenses.forEach(entry => {
        if (entry.type === 'expense') {
            categories[entry.category] = (categories[entry.category] || 0) + entry.amount;
        }
    });


    if (chart) {
        chart.destroy();
    }

    chart = new Chart(expenseChartCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Expenses',
                data: Object.values(categories),
                backgroundColor: 'green',
                borderColor: '#0366d6',
                borderWidth: 1
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


updateDisplay();
updateChart();