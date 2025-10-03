// --- Global Application State & Configuration ---

const state = {
    // Categories should align with the ML model's predictions and database entries
    categories: {
        expense: ['Rent/Housing', 'Food/Groceries', 'Transport', 'Entertainment', 'Bills/Utilities', 'Shopping', 'Other', 'Uncategorized'],
        income: ['Income', 'Salary', 'Investment']
    },
    transactions: [],
    budgets: {}, 
    currency: 'INR',
    currencySymbols: { 'INR': '₹', 'USD': '$', 'EUR': '€', 'GBP': '£' },
    language: 'en',
    // Minimal i18n for demonstration
    i18n: { 
        en: {
            appTitle: "FinSmart - Personal Finance Tracker", dashboard: "Dashboard", addTransaction: "Add Transaction",
            transactions: "Transactions", insights: "Insights", budgets: "Budgets", profile: "Profile", settings: "Settings",
            netBalance: "Net Balance", totalIncome: "Total Income", totalExpenses: "Total Expenses", savingsRate: "Savings Rate",
            dashboardHeader: "Personal Finance Dashboard", overview: "Overview", expenseDistribution: "Expense Distribution",
            recentTransactions: "Recent Transactions", viewAll: "View All", aiInsights: "AI Insights", addNewTransaction: "Add New Transaction",
            manualEntry: "Manual Entry", smsEmailParse: "SMS/Email Parse (AI)", type: "Type", expense: "Expense", income: "Income",
            amount: "Amount", category: "Category", description: "Description", date: "Date", addTransactionBtn: "Add Transaction",
            parseSMS: "Parse SMS Content", parseEmail: "Parse Email Content", autoAddSMS: "Auto-Add from SMS/Email", autoAddEmail: "Auto-Add from SMS/Email",
            smsPlaceholder: "Paste your bank SMS content here (e.g., 'A/C XXXX credited Rs. 15,000')...", emailPlaceholder: "Paste your bank SMS content here...",
            allTransactions: "All Transactions", onlyIncome: "Only Income", onlyExpense: "Only Expense", to: "to", exportCSV: "Export CSV",
            detailedInsights: "Detailed Financial Insights", manageBudgets: "Manage Budgets", createBudget: "Create New Budget",
            monthlyLimit: "Monthly Limit", setBudget: "Set Budget", currentBudgets: "Current Budgets", userProfile: "User Profile",
            accountDetails: "Account Details", username: "Username", email: "Email", memberSince: "Member Since", status: "Status",
            stats: "Statistics", totalTransactions: "Total Transactions Tracked:", highestExpense: "Highest Expense:", 
            averageSpending: "Average Monthly Spending:", changePassword: "Change Password", logout: "Logout",
            dataExportNote: "All data can be exported via the Transactions page.", settingsTitle: "Application Settings",
            financialSettings: "Financial Settings", baseCurrency: "Base Currency", financialYearStart: "Financial Year Start",
            uiSettings: "User Interface", language: "Language", darkMode: "Enable Dark Mode", enableNotifications: "Enable Notifications",
            dataManagement: "Data Management", backupData: "Backup Data", clearLocalData: "Clear Local Cache", saveSettings: "Save Settings",
            lowBudgetAlert: "Budget Warning: Approaching limit for ", exceededBudget: "Budget Exceeded for ", noBudgets: "No budgets set yet.",
            selectCategory: "Select Category", transactionAdded: "Transaction added successfully!", settingsSaved: "Settings saved successfully!",
            dataLoaded: "Data loaded from server.", failedToConnect: "Failed to connect to backend server.", failedToSave: "Failed to save transaction to server.",
            budgetSet: "Budget limit set successfully!", financialTip: "Financial Tip"
        },
        hi: {
            appTitle: "फिनस्मार्ट - निजी वित्त ट्रैकर", dashboard: "डैशबोर्ड", addTransaction: "लेनदेन जोड़ें",
            transactions: "लेन-देन", insights: "अंतर्दृष्टि", budgets: "बजट", profile: "प्रोफ़ाइल", settings: "सेटिंग्स",
            netBalance: "शुद्ध शेष", totalIncome: "कुल आय", totalExpenses: "कुल व्यय", savingsRate: "बचत दर",
            dashboardHeader: "निजी वित्त डैशबोर्ड", overview: "अवलोकन", expenseDistribution: "व्यय वितरण",
            recentTransactions: "हाल के लेनदेन", viewAll: "सभी देखें", aiInsights: "एआई अंतर्दृष्टि", addNewTransaction: "नया लेनदेन जोड़ें",
            manualEntry: "मैनुअल प्रविष्टि", smsEmailParse: "एसएमएस/ईमेल पार्स (एआई)", type: "प्रकार", expense: "व्यय", income: "आय",
            amount: "राशि", category: "श्रेणी", description: "विवरण", date: "तिथि", addTransactionBtn: "लेनदेन जोड़ें",
            parseSMS: "एसएमएस सामग्री पार्स करें", parseEmail: "ईमेल सामग्री पार्स करें", autoAddSMS: "एसएमएस/ईमेल से स्वतः जोड़ें", autoAddEmail: "एसएमएस/ईमेल से स्वतः जोड़ें",
            smsPlaceholder: "अपनी बैंक एसएमएस सामग्री यहां पेस्ट करें (उदा. 'A/C XXXX credited Rs. 15,000')...", emailPlaceholder: "अपनी बैंक एसएमएस सामग्री यहां पेस्ट करें...",
            allTransactions: "सभी लेनदेन", onlyIncome: "केवल आय", onlyExpense: "केवल व्यय", to: "से", exportCSV: "CSV निर्यात करें",
            detailedInsights: "विस्तृत वित्तीय अंतर्दृष्टि", manageBudgets: "बजट प्रबंधित करें", createBudget: "नया बजट बनाएं",
            monthlyLimit: "मासिक सीमा", setBudget: "बजट सेट करें", currentBudgets: "वर्तमान बजट", userProfile: "उपयोगकर्ता प्रोफ़ाइल",
            accountDetails: "खाता विवरण", username: "उपयोगकर्ता नाम", email: "ईमेल", memberSince: "सदस्यता", status: "स्थिति",
            stats: "सांख्यिकी", totalTransactions: "ट्रैक किए गए कुल लेनदेन:", highestExpense: "उच्चतम व्यय:", 
            averageSpending: "औसत मासिक खर्च:", changePassword: "पासवर्ड बदलें", logout: "लॉगआउट",
            dataExportNote: "सभी डेटा को लेनदेन पृष्ठ के माध्यम से निर्यात किया जा सकता है।", settingsTitle: "एप्लिकेशन सेटिंग्स",
            financialSettings: "वित्तीय सेटिंग्स", baseCurrency: "आधार मुद्रा", financialYearStart: "वित्तीय वर्ष प्रारंभ",
            uiSettings: "उपयोगकर्ता इंटरफ़ेस", language: "भाषा", darkMode: "डार्क मोड सक्षम करें", enableNotifications: "सूचनाएं सक्षम करें",
            dataManagement: "डेटा प्रबंधन", backupData: "डेटा बैकअप", clearLocalData: "स्थानीय कैश साफ़ करें", saveSettings: "सेटिंग्स सहेजें",
            lowBudgetAlert: "बजट चेतावनी: सीमा के करीब ", exceededBudget: "बजट पार हो गया ", noBudgets: "अभी तक कोई बजट सेट नहीं किया गया है।",
            selectCategory: "श्रेणी चुनें", transactionAdded: "लेनदेन सफलतापूर्वक जोड़ा गया!", settingsSaved: "सेटिंग्स सफलतापूर्वक सहेजी गईं!",
            dataLoaded: "डेटा सर्वर से लोड हुआ।", failedToConnect: "बैकएंड सर्वर से कनेक्ट करने में विफल।", failedToSave: "लेनदेन सर्वर पर सहेजने में विफल।",
            budgetSet: "बजट सीमा सफलतापूर्वक सेट की गई!", financialTip: "वित्तीय सुझाव"
        }
    }
};

const API_BASE_URL = 'http://127.0.0.1:8001/api'; 
let overviewChartInstance = null;

// --- Initialization and Core Setup ---

document.addEventListener('DOMContentLoaded', function() {
    // Set default date
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('transaction-date');
    if (dateInput) dateInput.value = today;

    loadSettingsFromLocalStorage(); 
    applyLanguage(state.language);

    initializeNavigation();
    initializeCategorySelector();
    initializeTransactionForm();
    initializeTabs();
    initializeParsing();
    initializeSettingsForm();
    initializeBudgeting();
    initializeExport();
    initializeClearCache();
    
    loadDataFromBackend();
});

// --- API Communication Functions ---

async function loadDataFromBackend() {
    try {
        const [summaryResponse, txResponse, budgetResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/data/summary`),
            fetch(`${API_BASE_URL}/data/transactions`),
            fetch(`${API_BASE_URL}/budgets`)
        ]);

        if (!summaryResponse.ok || !txResponse.ok || !budgetResponse.ok) throw new Error("Failed to fetch data.");

        const summaryData = await summaryResponse.json();
        const txResult = await txResponse.json();
        const budgetResult = await budgetResponse.json();

        state.transactions = txResult || []; 
        state.budgets = budgetResult || {};
        
        updateUI(summaryData); 
        showNotification(state.i18n[state.language].dataLoaded);

    } catch (error) {
        console.error("Could not connect to backend or fetch data:", error);
        showNotification(`${state.i18n[state.language].failedToConnect} ${error.message}`, true);
    }
}

async function saveTransactionToBackend(transaction) {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        
        const newTransaction = await response.json();
        return newTransaction; 
        
    } catch (error) {
        console.error("Could not save transaction:", error);
        showNotification(`${state.i18n[state.language].failedToSave}: ${error.message}`, true);
        return null;
    }
}

async function parseAndSaveRawTransaction(rawText) {
    try {
        const response = await fetch(`${API_BASE_URL}/predict_and_save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ raw_text: rawText })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Prediction failed: status ${response.status}`);
        }
        
        const savedTransaction = await response.json();
        return savedTransaction; 
        
    } catch (error) {
        console.error("Could not process raw text:", error);
        showNotification(`AI Failed: ${error.message}`, true);
        return null;
    }
}

async function saveBudgetToBackend(budget) {
    try {
        const response = await fetch(`${API_BASE_URL}/budgets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(budget)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result; 
        
    } catch (error) {
        console.error("Could not save budget:", error);
        showNotification(`${state.i18n[state.language].failedToSave}: ${error.message}`, true);
        return null;
    }
}

// --- Utility Functions ---

function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    if (!notification || !notificationText) return;
    
    notificationText.textContent = message;
    notification.classList.toggle('error', isError);
    notification.classList.add('show');
    
    // Clear existing timeout and set new one
    clearTimeout(notification.timeoutId);
    notification.timeoutId = setTimeout(() => { notification.classList.remove('show'); }, 4000);
}

// --- Internationalization (i18n) Logic ---

function applyLanguage(lang) {
    state.language = lang;
    document.documentElement.lang = lang; // Set HTML language attribute
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (state.i18n[lang] && state.i18n[lang][key]) {
            el.textContent = state.i18n[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (state.i18n[lang] && state.i18n[lang][key]) {
            el.setAttribute('placeholder', state.i18n[lang][key]);
        }
    });
    
    // Re-render components that rely on language
    // updateUI() will be called after settings are saved/loaded.
}

function loadSettingsFromLocalStorage() {
    const settings = localStorage.getItem('finSmartSettings');
    if (settings) {
        const parsed = JSON.parse(settings);
        state.currency = parsed.currency || 'INR';
        state.language = parsed.language || 'en';
    }
}

// --- Component Initialization Functions ---

function initializeNavigation() {
    const menuLinks = document.querySelectorAll('.menu-link');
    const sections = document.querySelectorAll('.section');
    
    function showSection(sectionId) {
        sections.forEach(section => section.classList.remove('active'));
        const targetSection = document.getElementById(sectionId);
        if (targetSection) targetSection.classList.add('active');
        
        menuLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.menu-link[data-target="${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');

        // Trigger updates when sections are viewed
        if (sectionId === 'dashboard') loadDataFromBackend(); // Reload data for fresh stats/charts
        if (sectionId === 'profile') updateProfileStats();
        if (sectionId === 'budgets') renderBudgets();
        if (sectionId === 'transactions') updateAllTransactions();
    }
    
    showSection('dashboard'); 
    
    document.querySelectorAll('[data-target]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showSection(this.getAttribute('data-target'));
        });
    });
}

function initializeCategorySelector() {
    const categorySelect = document.getElementById('transaction-category');
    const typeSelect = document.getElementById('transaction-type');
    
    function populateCategories(type) {
        categorySelect.innerHTML = `<option value="">${state.i18n[state.language].selectCategory}</option>`;
        const categories = state.categories[type] || [];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categorySelect.appendChild(option);
        });
    }

    typeSelect.addEventListener('change', (e) => populateCategories(e.target.value));
    populateCategories(typeSelect.value);

    // Also populate budget category selector (only expense categories)
    const budgetCategorySelect = document.getElementById('budget-category');
    if (budgetCategorySelect) {
        state.categories.expense
            .filter(c => c !== 'Uncategorized') // Don't allow budgets for Uncategorized
            .forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                budgetCategorySelect.appendChild(option);
            });
    }
}

function initializeTransactionForm() {
    const form = document.getElementById('transaction-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formType = document.getElementById('transaction-type').value;

        const transaction = {
            type: formType, // 'expense' or 'income'
            amount: parseFloat(document.getElementById('transaction-amount').value),
            description: document.getElementById('transaction-description').value,
            category: document.getElementById('transaction-category').value,
            date: document.getElementById('transaction-date').value,
            // Use description as placeholder for raw_text in manual entry
            raw_text: document.getElementById('transaction-description').value 
        };
        
        const savedTransaction = await saveTransactionToBackend(transaction); 
        
        if (savedTransaction) {
            // Reload all data to ensure stats are updated correctly
            loadDataFromBackend(); 
            form.reset();
            document.getElementById('transaction-date').value = new Date().toISOString().split('T')[0];
            showNotification(state.i18n[state.language].transactionAdded);
        }
    });
}

function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) { 
                    content.classList.add('active');
                }
            });
        });
    });
}

function initializeParsing() {
    const parseSmsBtn = document.getElementById('parse-sms');
    const smsContent = document.getElementById('sms-content');

    if (parseSmsBtn) {
        // Use a single button for both SMS/Email since the backend endpoint handles raw text
        parseSmsBtn.addEventListener('click', async function() {
            const rawText = smsContent.value;
            if (rawText) {
                const savedTransaction = await parseAndSaveRawTransaction(rawText);
                if (savedTransaction) {
                    loadDataFromBackend(); // Reload to show new AI-added transaction
                    smsContent.value = '';
                    showNotification(`AI added transaction: ${savedTransaction.category} on ${savedTransaction.date}`);
                }
            } else {
                 showNotification("Please paste transaction text to parse.", true);
            }
        });
    }
    
    // Remove the separate parse-email button if it exists, as the logic is the same
    const parseEmailBtn = document.getElementById('parse-email');
    if (parseEmailBtn) parseEmailBtn.remove();
    const emailContent = document.getElementById('email-content');
    if (emailContent) emailContent.remove();
}


function initializeBudgeting() {
    const form = document.getElementById('budget-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const category = document.getElementById('budget-category').value;
        const limit = parseFloat(document.getElementById('budget-amount').value);

        if (!category || !limit) return;

        const newBudget = { category, monthly_limit: limit };
        const savedBudgetResult = await saveBudgetToBackend(newBudget);

        if (savedBudgetResult && savedBudgetResult.status === 'success') {
            loadDataFromBackend(); // Reload budgets to get updated list
            showNotification(state.i18n[state.language].budgetSet);
            form.reset();
        }
    });
}

function initializeSettingsForm() {
    const form = document.getElementById('settings-form');
    const currencySelect = document.getElementById('currency');
    const languageSelect = document.getElementById('language');

    // Load saved settings and set form defaults
    loadSettingsFromLocalStorage();
    currencySelect.value = state.currency;
    languageSelect.value = state.language;
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newSettings = {
            currency: currencySelect.value,
            language: languageSelect.value,
            notifications: document.getElementById('notifications').checked,
            darkMode: document.getElementById('dark-mode').checked,
            financialYearStart: document.getElementById('financial-year').value
        };
        
        localStorage.setItem('finSmartSettings', JSON.stringify(newSettings));
        
        const oldLang = state.language;
        state.currency = newSettings.currency;
        state.language = newSettings.language;

        if (state.language !== oldLang) {
            applyLanguage(state.language); // Rerender all text for i18n
        }
        loadDataFromBackend(); // Reload UI with new settings (currency, language)

        showNotification(state.i18n[state.language].settingsSaved);
    });
}

function initializeClearCache() {
    const btn = document.getElementById('clear-local-data-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        localStorage.removeItem('finSmartSettings');
        showNotification("Local cache cleared. Settings reset to default.", true);
        window.location.reload();
    });
}

function initializeExport() {
    // Basic export logic (functional but simple)
    const exportBtn = document.getElementById('export-transactions-btn');
    if (!exportBtn) return;
    
    exportBtn.addEventListener('click', function() {
        if (state.transactions.length === 0) {
            showNotification("No data to export.", true);
            return;
        }

        const headers = ['ID', 'Date', 'Amount', 'Type', 'Category', 'Description', 'Raw Text'];
        const rows = state.transactions.map(t => [
            t.id, t.date, t.amount, t.type, t.category, t.description, t.raw_text
        ]);

        let csvContent = headers.join(',') + '\n';
        rows.forEach(row => {
            csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) { 
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'finsmart_transactions.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showNotification("Data exported successfully!");
        }
    });
}

// --- UI Update and Rendering Functions ---

/**
 * Main update function called after data load or save.
 * @param {object} summaryData - Data from /api/data/summary
 */
async function updateUI(summaryData) {
    updateStats(summaryData);
    updateRecentTransactions();
    updateAllTransactions();
    updateCharts(); // Fetches breakdown internally
    generateInsights(summaryData);
    renderBudgets(); 
    updateProfileStats();
}

function updateStats(summaryData) {
    const currencySymbol = state.currencySymbols[state.currency];
    const formatValue = (value) => `${currencySymbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    
    const totalIncome = summaryData.total_income;
    const totalExpenses = summaryData.total_expense;
    const totalBalance = summaryData.net_savings;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0;
    
    const balanceEl = document.getElementById('total-balance');
    const incomeEl = document.getElementById('total-income');
    const expensesEl = document.getElementById('total-expenses');
    const savingsEl = document.getElementById('savings-rate');

    if (balanceEl) balanceEl.textContent = formatValue(totalBalance);
    if (incomeEl) incomeEl.textContent = formatValue(totalIncome);
    if (expensesEl) expensesEl.textContent = formatValue(totalExpenses);
    if (savingsEl) savingsEl.textContent = `${savingsRate}%`;
}

function renderTransactionList(containerId, transactions, limit = Infinity) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const currencySymbol = state.currencySymbols[state.currency];
    
    if (transactions.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-receipt"></i><p>${state.i18n[state.language].noTransactions}</p></div>`;
        return;
    }
    
    const list = [...transactions].slice(0, limit); // Already sorted by ID DESC in DB
        
    container.innerHTML = '';
    
    list.forEach(transaction => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        
        // Use 'CREDIT'/'DEBIT' from backend
        const type_ = transaction.type.toUpperCase() === 'CREDIT' ? 'income' : 'expense';
        const amountClass = type_; 
        const category_name = transaction.category || 'Uncategorized';
        const categoryClass = `category-${category_name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
        
        item.innerHTML = `
            <div class="transaction-details">
                <div class="transaction-description">${transaction.description || transaction.raw_text}</div>
                <div>
                    <span class="transaction-category ${categoryClass}">${category_name}</span>
                    <span style="margin-left: 8px; color: var(--text-light); font-size: 0.8rem;">${transaction.date}</span>
                </div>
            </div>
            <div class="transaction-amount ${amountClass}">
                ${type_ === 'income' ? '+' : '-'}${currencySymbol}${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
        `;
        
        container.appendChild(item);
    });
}

function updateRecentTransactions() {
    renderTransactionList('recent-transactions', state.transactions, 5);
}

function updateAllTransactions() {
    renderTransactionList('all-transactions', state.transactions, Infinity);
}

async function updateCharts() {
    const chartContainer = document.querySelector('#dashboard .chart-container');
    if (!chartContainer) return;

    if (overviewChartInstance) overviewChartInstance.destroy();
    
    try {
        const response = await fetch(`${API_BASE_URL}/data/breakdown`);
        if (!response.ok) throw new Error("Failed to fetch breakdown data.");
        const expenseByCategory = await response.json();

        const categories = Object.keys(expenseByCategory);
        const amounts = Object.values(expenseByCategory);

        if (amounts.length === 0) {
            chartContainer.innerHTML = `<div class="empty-state"><i class="fas fa-chart-pie"></i><p>No expense data for chart visualization</p></div>`;
            return;
        }

        let chartEl = document.getElementById('overviewChart');
        if (!chartEl || chartContainer.querySelector('.empty-state')) {
            chartContainer.innerHTML = '<canvas id="overviewChart"></canvas>';
            chartEl = document.getElementById('overviewChart');
        }

        const ctx = chartEl.getContext('2d');
        
        overviewChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: amounts,
                    backgroundColor: ['#6a11cb', '#2575fc', '#00b09b', '#ff416c', '#ff8c00', '#00d2ff', '#7209b7', '#3a86ff'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    title: { display: true, text: state.i18n[state.language].expenseDistribution }
                }
            }
        });
        
    } catch (error) {
        chartContainer.innerHTML = `<div class="empty-state"><i class="fas fa-chart-pie"></i><p>Error loading chart data.</p></div>`;
        console.error("Chart loading error:", error);
    }
}

function generateInsights(summaryData) {
    const container = document.getElementById('ai-insights');
    if (!container) return;
    
    const insights = summaryData.recommendations.map(msg => {
        let type = 'info';
        let icon = 'fas fa-lightbulb';
        let title = state.i18n[state.language].financialTip;

        if (msg.includes('High Food Spending')) {
            type = 'warning';
            icon = 'fas fa-exclamation-triangle';
            title = 'High Spending Alert';
        } else if (msg.includes('Excellent')) {
            type = 'success';
            icon = 'fas fa-award';
            title = 'Great Performance';
        }
        
        return { type, title, message: msg, icon };
    });
    
    container.innerHTML = '';
    insights.forEach(insight => {
        const card = document.createElement('div');
        card.className = `insight-card ${insight.type}`;
        card.innerHTML = `
            <div class="insight-header">
                <i class="insight-icon ${insight.icon}"></i>
                <strong>${insight.title}</strong>
            </div>
            <p>${insight.message}</p>
        `;
        container.appendChild(card);
    });
}

function renderBudgets() {
    const container = document.getElementById('budget-list');
    if (!container) return;
    container.innerHTML = '';
    
    const currencySymbol = state.currencySymbols[state.currency];
    const budgets = state.budgets;
    
    if (Object.keys(budgets).length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-wallet"></i><p>${state.i18n[state.language].noBudgets}</p></div>`;
        return;
    }

    Object.keys(budgets).forEach(category => {
        const { limit, spent } = budgets[category];
        const percentage = Math.min(100, (spent / limit) * 100);
        let progressClass;
        
        if (percentage > 95) progressClass = 'progress-danger';
        else if (percentage > 80) progressClass = 'progress-warning';
        else progressClass = 'progress-success';
        
        const item = document.createElement('div');
        item.className = 'budget-item';
        item.innerHTML = `
            <span class="budget-category">${category}</span>
            <div class="budget-progress-bar">
                <div class="budget-progress ${progressClass}" style="width: ${percentage}%;"></div>
            </div>
            <span class="budget-amount">
                ${currencySymbol}${spent.toFixed(2)} / ${currencySymbol}${limit.toFixed(2)}
            </span>
        `;
        container.appendChild(item);
        
        // Show alerts if necessary
        if (state.i18n.en.enableNotifications) {
            if (percentage > 95) showNotification(`${state.i18n[state.language].exceededBudget} ${category}.`, true);
            else if (percentage > 80) showNotification(`${state.i18n[state.language].lowBudgetAlert} ${category}.`);
        }
    });
}

function updateProfileStats() {
    const currencySymbol = state.currencySymbols[state.currency];

    // 1. Total Transactions
    document.getElementById('profile-total-tx').textContent = state.transactions.length;

    // 2. Highest Expense
    const highestExpense = state.transactions
        .filter(t => t.type.toUpperCase() === 'DEBIT')
        .reduce((max, t) => Math.max(max, t.amount), 0);
    document.getElementById('profile-highest-expense').textContent = `${currencySymbol}${highestExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

    // 3. Average Monthly Spending
    const expenseByMonth = state.transactions
        .filter(t => t.type.toUpperCase() === 'DEBIT')
        .reduce((acc, t) => {
            const monthYear = t.date.substring(0, 7); // YYYY-MM
            acc[monthYear] = (acc[monthYear] || 0) + t.amount;
            return acc;
        }, {});
        
    const monthsCount = Object.keys(expenseByMonth).length || 1;
    const totalExpense = Object.values(expenseByMonth).reduce((sum, amount) => sum + amount, 0);
    const avgSpending = totalExpense / monthsCount;

    document.getElementById('profile-avg-spending').textContent = `${currencySymbol}${avgSpending.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}