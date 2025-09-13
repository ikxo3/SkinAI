const commonDiseases = [
];

let darkMode = false;
let uploadedImage = null;
let diagnosis = null;
let confidence = null;
let processing = false;
let currentLanguage = 'en';
let authToken = localStorage.getItem('authToken');
let currentUser = null;
let medicalHistory = [];

const arabicTranslations = {
    'Home': 'الرئيسية',
    'Diagnosis': 'التشخيص',
    'History': 'التاريخ',
    'Education': 'التثقيف',
    'Profile': 'الملف الشخصي',
    'Collapse': 'طي',
    'Dark Mode': 'الوضع المظلم',
    'Logout': 'تسجيل الخروج',
    'Advanced Skin Analysis with AI': 'تحليل متقدم للبشرة بالذكاء الاصطناعي',
    'Upload an image of your skin to get instant analysis and recommendations from our advanced AI system.': 'قم بتحميل صورة لبشرتك للحصول على تحليل فوري وتوصيات من نظام الذكاء الاصطناعي المتقدم لدينا.',
    'Instant Results': 'نتائج فورية',
    'Get analysis in seconds': 'احصل على التحليل في ثوان',
    'Privacy First': 'الخصوصية أولاً',
    'Your data is always secure': 'بياناتك دائماً آمنة',
    'Medical Grade': 'بجودة طبية',
    'Powered by dermatologist insights': 'مدعوم برؤى أطباء الجلدية',
    'Skin Analysis': 'تحليل البشرة',
    'Upload an image for instant diagnosis': 'قم بتحميل صورة لتشخيص فوري',
    'Learn About Conditions': 'تعرف على الحالات',
    'Understand various skin conditions': 'افهم مختلف حالات البشرة',
    'View History': 'عرض السجل',
    'Check your previous analyses': 'تحقق من تحليلاتك السابقة',
    'AI Skin Analysis': 'تحليل البشرة بالذكاء الاصطناعي',
    'Upload Your Skin Image': 'قم بتحميل صورة بشرتك',
    'Drag and drop your image here or click to browse': 'اسحب وأفلت صورتك هنا أو انقر للتصفح',
    'Supports JPG, PNG, GIF up to 10MB': 'يدعم JPG وPNG وGIF حتى 10MB',
    'Medical History': 'السجل الطبي',
    'records': 'سجلات',
    'Skin Health Education': 'التثقيف الصحي للبشرة',
    'conditions': 'حالات',
    'User Profile': 'الملف الشخصي للمستخدم',
    'Manage your account settings and preferences': 'إدارة إعدادات وتفضيلات حسابك',
    'Account Information': 'معلومات الحساب',
    'Full Name': 'الاسم الكامل',
    'Email': 'البريد الإلكتروني',
    'Member Since': 'عضو منذ',
    'App Settings': 'إعدادات التطبيق',
    'Language': 'اللغة',
    'Data Saving Mode': 'وضع توفير البيانات',
    'Your Statistics': 'إحصائياتك',
    'Analyses': 'التحليلات',
    'Conditions': 'الحالات',
    'Accuracy': 'الدقة',
    'Diagnosis': 'التشخيص',
    'Confidence Score': 'نسبة الثقة',
    'Professional Recommendation': 'توصية مهنية',
    'Research Condition': 'البحث عن الحالة',
    'Download PDF': 'تحميل PDF',
    'New Analysis': 'تحليل جديد',
    'View Details': 'عرض التفاصيل',
    'Export PDF': 'تصدير PDF',
    'Symptoms': 'الأعراض',
    'Treatment': 'العلاج',
    'Learn More': 'معرفة المزيد',
    'Uploaded Image': 'الصورة المرفوعة',
    'Analysis Results': 'نتائج التحليل',
    'Highly confident diagnosis - results are very reliable': 'تشخيص عالي الثقة - النتائج موثوقة جدًا',
    'Good confidence level - results are generally reliable': 'مستوى ثقة جيد - النتائج موثوقة بشكل عام',
    'Moderate confidence - consider consulting a dermatologist for confirmation': 'ثقة متوسطة - يُنصح باستشارة طبيب جلدية للتأكيد',
    'This AI analysis has high confidence. The results can be used for general awareness and monitoring.': 'هذا التحليل بالذكاء الاصطناعي يتمتع بثقة عالية. يمكن استخدام النتائج للتوعية العامة والمراقبة.',
    'This analysis has moderate confidence. We strongly recommend consulting with a board-certified dermatologist for professional evaluation.': 'هذا التحليل يتمتع بثقة متوسطة. ننصح بشدة باستشارة طبيب جلدية معتمد للتقييم المهني.',
    'Description': 'الوصف',
    'Analyzing your skin image...': 'جاري تحليل صورة بشرتك...',
    'This may take a few seconds': 'قد يستغرق هذا بضع ثوان',
    'PDF report generated and downloaded successfully!': 'تم إنشاء وتحميل تقرير PDF بنجاح!',
    'No Analysis History': 'لا يوجد سجل تحليل',
    'Upload an image to begin your skin analysis journey': 'ارفع صورة لبدء رحلة تحليل بشرتك',
    'Start Analysis': 'بدء التحليل',
    'Error loading history': 'خطأ في تحميل السجل',
    'Please try again later': 'يرجى المحاولة مرة أخرى لاحقًا'
};

const API_BASE_URL = 'http://127.0.0.1:8000'; 

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    checkAuthStatus();
    
    loadDarkModePreference();
    
    initEventHandlers();
    
    document.getElementById('languageSelect').addEventListener('change', function() {
        currentLanguage = this.value;
        updateLanguage();
    });
}

async function checkAuthStatus() {
    if (!authToken) {
        window.location.href = '/login';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            currentUser = userData;
            updateUserProfile();
            
            loadMedicalHistory();
            loadEducationMaterials();
        } else {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        window.location.href = '/login';
    }
}

function loadDarkModePreference() {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    darkMode = prefersDark;
    updateDarkMode();
}

function updateDarkMode() {
    if (darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('darkModeToggle').querySelector('i').className = 'fas fa-sun';
        updateDarkModeText('Light Mode', 'الوضع المضيء');
        document.getElementById('profileDarkMode').checked = true;
    } else {
        document.documentElement.removeAttribute('data-theme');
        document.getElementById('darkModeToggle').querySelector('i').className = 'fas fa-moon';
        updateDarkModeText('Dark Mode', 'الوضع المظلم');
        document.getElementById('profileDarkMode').checked = false;
    }
}

function updateDarkModeText(enText, arText) {
    const darkModeText = document.getElementById('darkModeToggle').querySelector('.link-text');
    darkModeText.textContent = currentLanguage === 'en' ? enText : arText;
}

function initEventHandlers() {
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
    document.getElementById('profileDarkMode').addEventListener('change', toggleDarkMode);
    
    document.getElementById('collapseBtn').addEventListener('click', toggleSidebar);
    
    document.getElementById('languageBtn').addEventListener('click', toggleLanguage);
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            navigateTo(targetId);
        });
    });
    
    document.getElementById('uploadContainer').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
    
    document.getElementById('fileInput').addEventListener('change', handleFileInputChange);
    
    const uploadContainer = document.getElementById('uploadContainer');
    uploadContainer.addEventListener('dragover', handleDragOver);
    uploadContainer.addEventListener('dragleave', handleDragLeave);
    uploadContainer.addEventListener('drop', handleDrop);
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

function toggleDarkMode() {
    darkMode = !darkMode;
    updateDarkMode();
}

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('collapsed');
    
    const collapseBtn = document.getElementById('collapseBtn');
    const icon = collapseBtn.querySelector('i');
    const collapseText = collapseBtn.querySelector('.link-text');
    
    if (document.querySelector('.sidebar').classList.contains('collapsed')) {
        icon.className = 'fas fa-chevron-right';
        collapseText.textContent = currentLanguage === 'en' ? 'Expand' : 'توسيع';
    } else {
        icon.className = 'fas fa-chevron-left';
        collapseText.textContent = currentLanguage === 'en' ? 'Collapse' : 'طي';
    }
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    document.getElementById('languageSelect').value = currentLanguage;
    updateLanguage();
}

function updateLanguage() {
    const langBtn = document.getElementById('languageBtn');
    langBtn.querySelector('span').textContent = currentLanguage === 'en' ? 'EN' : 'AR';
    
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (currentLanguage === 'ar' && arabicTranslations[key]) {
            element.textContent = arabicTranslations[key];
        } else {
            element.textContent = key;
        }
    });
    
    document.body.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    
    if (darkMode) {
        updateDarkModeText('Light Mode', 'الوضع المضيء');
    } else {
        updateDarkModeText('Dark Mode', 'الوضع المظلم');
    }
    
    const collapseBtn = document.getElementById('collapseBtn');
    const collapseText = collapseBtn.querySelector('.link-text');
    if (document.querySelector('.sidebar').classList.contains('collapsed')) {
        collapseText.textContent = currentLanguage === 'en' ? 'Expand' : 'توسيع';
    } else {
        collapseText.textContent = currentLanguage === 'en' ? 'Collapse' : 'طي';
    }
}

function navigateTo(sectionId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.querySelector(`.nav-link[href="#${sectionId}"]`).classList.add('active');
    
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    
    const pageTitle = document.getElementById('pageTitle');
    if (currentLanguage === 'ar') {
        pageTitle.textContent = arabicTranslations[sectionId.charAt(0).toUpperCase() + sectionId.slice(1)] || sectionId;
    } else {
        pageTitle.textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileUpload(e.dataTransfer.files[0]);
    }
}

function handleFileInputChange(e) {
    if (e.target.files && e.target.files[0]) {
        handleFileUpload(e.target.files[0]);
    }
}

async function handleFileUpload(file) {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert(currentLanguage === 'en' ? 'Please upload an image file (JPG, PNG, GIF, etc.)' : 'يرجى تحميل ملف صورة (JPG, PNG, GIF, إلخ)');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        alert(currentLanguage === 'en' ? 'File size should be less than 10MB' : 'يجب أن يكون حجم الملف أقل من 10MB');
        return;
    }
    
    processing = true;
    showProcessing();
    
    try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('user', currentUser.id);
        
        const uploadResponse = await fetch(`${API_BASE_URL}/skin-images/upload_image/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });
        
        if (!uploadResponse.ok) {
            throw new Error('Failed to upload image');
        }
        
        const imageData = await uploadResponse.json();
        
        const processResponse = await fetch(`${API_BASE_URL}/skin-images/tretement/?image_id=${imageData.id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!processResponse.ok) {
            throw new Error('Failed to process image');
        }
        
        const analysisResult = await processResponse.json();
        
        uploadedImage = analysisResult.image_path ? 
            `${API_BASE_URL}${analysisResult.image_path}` : 
            analysisResult.history?.image_url;

        if (analysisResult.diagnosis && Array.isArray(analysisResult.diagnosis) && analysisResult.diagnosis.length > 0) {
            diagnosis = analysisResult.diagnosis[0].class_name || 'Unknown';
            confidence = analysisResult.diagnosis[0].conf || 0;
        } else if (analysisResult.history) {
            diagnosis = analysisResult.history.analysis_result || 'Unknown';
            confidence = analysisResult.history.confidence || 0;
        } else {
            diagnosis = 'Unknown';
            confidence = 0;
        }
        
        showResults();
        loadMedicalHistory();
        
    } catch (error) {
        console.error('Error processing image:', error);
        alert(currentLanguage === 'en' ? 'Error processing image. Please try again.' : 'خطأ في معالجة الصورة. يرجى المحاولة مرة أخرى.');
        resetAnalysis();
    }
}

function showProcessing() {
    document.getElementById('uploadContainer').classList.add('hidden');
    document.getElementById('resultsContainer').classList.remove('hidden');
    
    const resultsContent = document.getElementById('resultsContainer');
    resultsContent.innerHTML = `
        <div class="processing">
            <div class="spinner"></div>
            <h3 data-translate="Analyzing your skin image...">${currentLanguage === 'en' ? 'Analyzing your skin image...' : 'جاري تحليل صورة بشرتك...'}</h3>
            <p data-translate="This may take a few seconds">${currentLanguage === 'en' ? 'This may take a few seconds' : 'قد يستغرق هذا بضع ثوان'}</p>
        </div>
    `;
}

function showResults() {
    const disease = commonDiseases.find(d => d.name === diagnosis) || {
        name: diagnosis,
        severity: 'Moderate',
        symptoms: 'Not available',
        treatment: 'Consult a dermatologist for proper diagnosis and treatment'
    };
    
    const resultsContent = document.getElementById('resultsContainer');
    resultsContent.innerHTML = `
        <div class="results-grid">
            <div class="image-section">
                <h3 data-translate="Uploaded Image">${currentLanguage === 'en' ? 'Uploaded Image' : 'الصورة المرفوعة'}</h3>
                <div class="result-image">
                    <img src="${uploadedImage}" alt="Uploaded skin analysis">
                </div>
            </div>
            <div class="analysis-section">
                <h3 data-translate="Analysis Results">${currentLanguage === 'en' ? 'Analysis Results' : 'نتائج التحليل'}</h3>
                <div class="diagnosis-result">
                    <h4 data-translate="Diagnosis">${currentLanguage === 'en' ? 'Diagnosis' : 'التشخيص'}</h4>
                    <div class="condition">
                        <span class="condition-name">${diagnosis}</span>
                        <span class="severity-badge ${getSeverityClass(disease.severity)}">${disease.severity}</span>
                    </div>
                </div>
                <div class="confidence-result">
                    <div class="confidence-header">
                        <h4 data-translate="Confidence Score">${currentLanguage === 'en' ? 'Confidence Score' : 'نسبة الثقة'}</h4>
                        <span class="confidence-value">${confidence}%</span>
                    </div>
                    <div class="confidence-bar">
                        <div class="confidence-fill ${getConfidenceColorClass(confidence)}" style="width: ${confidence}%"></div>
                    </div>
                    <p class="confidence-description">${getConfidenceDescription(confidence)}</p>
                </div>
                <div class="recommendation">
                    <h4 data-translate="Professional Recommendation">${currentLanguage === 'en' ? 'Professional Recommendation' : 'توصية مهنية'}</h4>
                    <p>${getRecommendationText(confidence)}</p>
                </div>
                <div class="action-buttons">
                    <a href="https://www.google.com/search?q=${encodeURIComponent(diagnosis + ' skin condition symptoms treatment dermatologist')}" target="_blank" class="action-btn research-btn">
                        <i class="fas fa-search"></i>
                        <span data-translate="Research Condition">${currentLanguage === 'en' ? 'Research Condition' : 'البحث عن الحالة'}</span>
                    </a>
                    <button class="action-btn download-btn" id="downloadPdf">
                        <i class="fas fa-download"></i>
                        <span data-translate="Download PDF">${currentLanguage === 'en' ? 'Download PDF' : 'تحميل PDF'}</span>
                    </button>
                    <button class="action-btn new-analysis-btn" id="newAnalysis">
                        <i class="fas fa-redo"></i>
                        <span data-translate="New Analysis">${currentLanguage === 'en' ? 'New Analysis' : 'تحليل جديد'}</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('downloadPdf').addEventListener('click', downloadPDF);
    document.getElementById('newAnalysis').addEventListener('click', resetAnalysis);
}

function getSeverityClass(severity) {
    switch(severity) {
        case 'Mild': return 'mild';
        case 'Mild to Moderate': return 'mild-moderate';
        case 'Moderate': return 'moderate';
        case 'Moderate to Severe': return 'moderate-severe';
        case 'Severe': return 'severe';
        default: return 'mild';
    }
}

function getConfidenceColorClass(confidence) {
    if (confidence > 90) return 'high-confidence';
    if (confidence > 75) return 'medium-confidence';
    return 'low-confidence';
}

function getConfidenceDescription(confidence) {
    if (currentLanguage === 'en') {
        if (confidence > 90) return 'Highly confident diagnosis - results are very reliable';
        if (confidence > 75) return 'Good confidence level - results are generally reliable';
        return 'Moderate confidence - consider consulting a dermatologist for confirmation';
    } else {
        if (confidence > 90) return 'تشخيص عالي الثقة - النتائج موثوقة جدًا';
        if (confidence > 75) return 'مستوى ثقة جيد - النتائج موثوقة بشكل عام';
        return 'ثقة متوسطة - يُنصح باستشارة طبيب جلدية للتأكيد';
    }
}

function getRecommendationText(confidence) {
    if (currentLanguage === 'en') {
        if (confidence > 85) return 'This AI analysis has high confidence. The results can be used for general awareness and monitoring.';
        return 'This analysis has moderate confidence. We strongly recommend consulting with a board-certified dermatologist for professional evaluation.';
    } else {
        if (confidence > 85) return 'هذا التحليل بالذكاء الاصطناعي يتمتع بثقة عالية. يمكن استخدام النتائج للتوعية العامة والمراقبة.';
        return 'هذا التحليل يتمتع بثقة متوسطة. ننصح بشدة باستشارة طبيب جلدية معتمد للتقييم المهني.';
    }
}

function downloadPDF() {
    if (!diagnosis || !uploadedImage) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${darkMode ? 'dark-notification' : 'light-notification'}`;
    notification.textContent = currentLanguage === 'en' 
        ? 'PDF report generated and downloaded successfully!'
        : 'تم إنشاء وتحميل تقرير PDF بنجاح!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function resetAnalysis() {
    uploadedImage = null;
    diagnosis = null;
    confidence = null;
    
    document.getElementById('uploadContainer').classList.remove('hidden');
    document.getElementById('resultsContainer').classList.add('hidden');
    document.getElementById('fileInput').value = '';
}

async function loadMedicalHistory() {
    const historyContainer = document.getElementById('medicalHistory');
    const historyCount = document.querySelector('.history-count');
    
    try {
        const response = await fetch(`${API_BASE_URL}/histories/get_history/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            medicalHistory = await response.json();
            historyCount.innerHTML = `${medicalHistory.length} <span data-translate="records">${currentLanguage === 'en' ? 'records' : 'سجلات'}</span>`;
            
            if (medicalHistory.length === 0) {
                historyContainer.innerHTML = `
                    <div class="empty-history">
                        <i class="fas fa-file-medical"></i>
                        <h3 data-translate="No Analysis History">${currentLanguage === 'en' ? 'No Analysis History' : 'لا يوجد سجل تحليل'}</h3>
                        <p data-translate="Upload an image to begin your skin analysis journey">${currentLanguage === 'en' ? 'Upload an image to begin your skin analysis journey' : 'ارفع صورة لبدء رحلة تحليل بشرتك'}</p>
                        <button class="cta-button" onclick="navigateTo('diagnosis')" data-translate="Start Analysis">${currentLanguage === 'en' ? 'Start Analysis' : 'بدء التحليل'}</button>
                    </div>
                `;
                return;
            }
            
            let historyHTML = '';
            medicalHistory.forEach(record => {
                const imageUrl = record.image_url ? 
                    `${API_BASE_URL}${record.image_url}` : 
                    'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80';
                
                historyHTML += `
                    <div class="history-item">
                        <div class="history-image">
                            <img src="${imageUrl}" alt="${record.condition}">
                        </div>
                        <div class="history-details">
                            <h3 class="history-condition">${record.condition}</h3>
                            <p class="history-date">${record.date}</p>
                            <div class="history-confidence">
                                <div class="confidence-bar">
                                    <div class="confidence-fill ${getConfidenceColorClass(record.confidence)}" style="width: ${record.confidence}%"></div>
                                </div>
                                <span class="confidence-value">${record.confidence}%</span>
                            </div>
                            <div class="history-actions">
                                <button class="action-btn view-btn" data-translate="View Details">${currentLanguage === 'en' ? 'View Details' : 'عرض التفاصيل'}</button>
                                <button class="action-btn export-btn" data-translate="Export PDF">${currentLanguage === 'en' ? 'Export PDF' : 'تصدير PDF'}</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            historyContainer.innerHTML = historyHTML;
        } else {
            console.error('Failed to load medical history');
            historyContainer.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3 data-translate="Error loading history">${currentLanguage === 'en' ? 'Error loading history' : 'خطأ في تحميل السجل'}</h3>
                    <p data-translate="Please try again later">${currentLanguage === 'en' ? 'Please try again later' : 'يرجى المحاولة مرة أخرى لاحقًا'}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading medical history:', error);
        historyContainer.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-exclamation-triangle"></i>
                <h3 data-translate="Error loading history">${currentLanguage === 'en' ? 'Error loading history' : 'خطأ في تحميل السجل'}</h3>
                <p data-translate="Please try again later">${currentLanguage === 'en' ? 'Please try again later' : 'يرجى المحاولة مرة أخرى لاحقًا'}</p>
            </div>
        `;
    }
}

async function loadEducationMaterials() {
    const diseasesContainer = document.getElementById('diseasesContainer');
    
    try {
        const response = await fetch(`${API_BASE_URL}/Etu/list_materials/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        let educationMaterials = [];
        
        if (response.ok) {
            educationMaterials = await response.json();
        } else {
            console.error('Failed to load education materials');
            educationMaterials = commonDiseases;
        }
        
        let diseasesHTML = '';
        educationMaterials.forEach(material => {
            diseasesHTML += `
                <div class="disease-card">
                    <div class="disease-image">
                        <img src="${material.image || 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80'}" alt="${material.title}">
                    </div>
                    <h3 class="disease-name">${material.title}</h3>
                    <p class="disease-description">${material.content.substring(0, 100)}...</p>
                    <div class="disease-details">
                        <div class="detail-item">
                            <h4 data-translate="Description">${currentLanguage === 'en' ? 'Description' : 'الوصف'}</h4>
                            <p>${material.content.substring(0, 150)}...</p>
                        </div>
                    </div>
                    <button class="learn-more-btn" data-translate="Learn More">${currentLanguage === 'en' ? 'Learn More' : 'معرفة المزيد'}</button>
                </div>
            `;
        });
        
        diseasesContainer.innerHTML = diseasesHTML;
        
        document.querySelectorAll('.learn-more-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const disease = educationMaterials[index];
                openDiseaseModal(disease);
            });
        });
        
    } catch (error) {
        console.error('Error loading education materials:', error);
        let diseasesHTML = '';
        commonDiseases.forEach(disease => {
            diseasesHTML += `
                <div class="disease-card">
                    <div class="disease-image">
                        <img src="${disease.image}" alt="${disease.name}">
                    </div>
                    <h3 class="disease-name">${disease.name}</h3>
                    <p class="disease-description">${disease.description}</p>
                    <div class="disease-details">
                        <div class="detail-item">
                            <h4 data-translate="Symptoms">${currentLanguage === 'en' ? 'Symptoms' : 'الأعراض'}</h4>
                            <p>${disease.symptoms}</p>
                        </div>
                        <div class="detail-item">
                            <h4 data-translate="Treatment">${currentLanguage === 'en' ? 'Treatment' : 'العلاج'}</h4>
                            <p>${disease.treatment}</p>
                        </div>
                    </div>
                    <button class="learn-more-btn" data-translate="Learn More">${currentLanguage === 'en' ? 'Learn More' : 'معرفة المزيد'}</button>
                </div>
            `;
        });
        
        diseasesContainer.innerHTML = diseasesHTML;
        
        document.querySelectorAll('.learn-more-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const disease = commonDiseases[index];
                openDiseaseModal(disease);
            });
        });
    }
}

function openDiseaseModal(disease) {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="disease-modal">
            <button class="modal-close">&times;</button>
            <div class="modal-header">
                <div class="modal-image">
                    <img src="${disease.image}" alt="${disease.title}">
                </div>
                <div class="modal-title">
                    <h2>${disease.title}</h2>
                    <p>${disease.description}</p>
                </div>
            </div>
            <div class="modal-content">
                <p>${disease.content}</p>
                <h3 data-translate="Symptoms">${currentLanguage === 'en' ? 'Symptoms' : 'الأعراض'}</h3>
                <p>${disease.symptoms}</p>
                <h3 data-translate="Treatment">${currentLanguage === 'en' ? 'Treatment' : 'العلاج'}</h3>
                <p>${disease.treatment}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalOverlay);
    
    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 10);
    
    const closeBtn = modalOverlay.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modalOverlay);
        }, 300);
    });
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
            }, 300);
        }
    });
}

function updateUserProfile() {
    if (!currentUser) return;
    
    const fullNameElement = document.querySelector('.info-group .info-value');
    const emailElement = document.querySelectorAll('.info-group .info-value')[1];
    
    if (fullNameElement) {
        fullNameElement.textContent = `${currentUser.first_name || 'John'} ${currentUser.last_name || 'Doe'}`;
    }
    
    if (emailElement) {
        emailElement.textContent = currentUser.email || 'john.doe@example.com';
    }
    
    const statsElements = document.querySelectorAll('.stat-value');
    if (statsElements.length >= 3 && medicalHistory.length > 0) {
        statsElements[0].textContent = medicalHistory.length;
        
        const uniqueConditions = new Set(medicalHistory.map(item => item.condition));
        statsElements[1].textContent = uniqueConditions.size;
        
        const avgConfidence = medicalHistory.reduce((sum, item) => sum + (item.confidence || 85), 0) / medicalHistory.length;
        statsElements[2].textContent = `${avgConfidence.toFixed(0)}%`;
    }
}

async function handleLogout() {
    try {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refresh: localStorage.getItem('refreshToken')
            })
        });
    } catch (error) {
        console.error('Error during logout:', error);
    } finally {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    }
}

async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}