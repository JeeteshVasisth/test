import { sendChatMessage, identifyScrap, calculateValue, generateContactResponse } from './services/apiClient.js';

// --- DOM Manipulation & Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {

    // --- HEADER SCROLL EFFECT ---
    const header = document.querySelector('header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // --- MOBILE MENU ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuCloseButton = document.getElementById('mobile-menu-close-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = mobileMenu?.querySelectorAll('a, button');

    const toggleMobileMenu = () => {
        mobileMenu?.classList.toggle('translate-x-full');
        document.body.classList.toggle('overflow-hidden');
    };

    mobileMenuButton?.addEventListener('click', toggleMobileMenu);
    mobileMenuCloseButton?.addEventListener('click', toggleMobileMenu);

    mobileMenuLinks?.forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('translate-x-full')) {
                toggleMobileMenu();
            }
        });
    });

    // --- SMOOTH SCROLLING ---
    document.querySelectorAll('a[href^="#"], button[data-scroll-to]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href') || this.dataset.scrollTo;
            document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // --- DYNAMIC CONTENT INJECTION ---
    const servicesContainer = document.querySelector('#services .grid');
    if (servicesContainer) {
        const services = [
          { icon: `<svg class="w-12 h-12 mb-4 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125-.504 1.125-1.125V10.5a1.125 1.125 0 00-1.125-1.125h-3.375M3 15h3.375c.621 0 1.125-.504 1.125-1.125V10.5a1.125 1.125 0 00-1.125-1.125H3M3 15V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v7.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15z" /></svg>`, title: 'Paper & Cardboard', description: 'Newspapers, books, magazines, and all types of cardboard boxes.' },
          { icon: `<svg class="w-12 h-12 mb-4 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 4.787a.75.75 0 00-1.01-.712l-7.22 3.011a.75.75 0 01-.54 0L4.01 4.075a.75.75 0 00-1.01.712v13.425a.75.75 0 001.01.712l7.22-3.011a.75.75 0 01.54 0l7.22 3.011a.75.75 0 001.01-.712V4.787z" /></svg>`, title: 'Plastics', description: 'PET bottles, milk jugs, containers, and other household plastic items.' },
          { icon: `<svg class="w-12 h-12 mb-4 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.478 5.408L2.25 6.634m18 0l-1.228-1.226M12 21.75V19.5M12 2.25V4.5m4.243 2.25l1.226-1.227M5.25 6.634l1.227-1.227M18.75 17.366l-1.227-1.226M6.477 17.366l-1.227 1.226M12 12a2.25 2.25 0 012.25 2.25V15a2.25 2.25 0 01-4.5 0v-.75A2.25 2.25 0 0112 12z" /></svg>`, title: 'Metals', description: 'Iron, steel, aluminum cans, copper wires, and brass items.' },
          { icon: `<svg class="w-12 h-12 mb-4 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m-6 0V15M9 12.75H6.75M15 12.75H12.75m-6 0H9m3 0h.008M12 15h.008m-3 0h.008m0 0h.008m2.992 0h.008M9 15v-2.25m3 2.25v-2.25m3-2.25V15M12 9.75l-1.5 1.5-1.5-1.5M12 9.75V7.5M12 9.75l1.5 1.5 1.5-1.5M15 5.25H9a3 3 0 00-3 3v3.75a3 3 0 003 3h6a3 3 0 003-3V8.25a3 3 0 00-3-3z" /></svg>`, title: 'E-Waste', description: 'Old laptops, mobile phones, chargers, TVs, and other electronics.' },
        ];
        services.forEach((service, index) => {
            const card = document.createElement('div');
            card.className = "animate-fade-in-up";
            card.style.animationDelay = `${index * 150}ms`;
            card.innerHTML = `
                <div class="bg-white p-8 rounded-lg shadow-lg card-hover-effect h-full">
                    ${service.icon}
                    <h3 class="text-2xl font-bold mb-3 text-brand-dark">${service.title}</h3>
                    <p class="text-brand-gray">${service.description}</p>
                </div>`;
            servicesContainer.appendChild(card);
        });
    }

    const processContainer = document.getElementById('process-steps-container');
    if (processContainer) {
        const steps = [
          { icon: `<svg class="w-16 h-16 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" /></svg>`, title: '1: Schedule Pickup', description: 'Fill out our simple form to book a convenient time for collection.' },
          { icon: `<svg class="w-16 h-16 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`, title: '2: Kabaadiwala Arrives', description: 'A verified local scrap dealer arrives at your doorstep on time.' },
          { icon: `<svg class="w-16 h-16 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`, title: '3: Weigh & Get Paid', description: 'Your items are weighed transparently, and you receive instant cash.' },
          { icon: `<svg class="w-16 h-16 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" /></svg>`, title: '4: Eco-Friendly Recycling', description: 'Your scrap is sent for responsible recycling, protecting our planet.' },
        ];
        steps.forEach((step, index) => {
            const stepEl = document.createElement('div');
            stepEl.className = "flex flex-col items-center text-center p-4 md:w-1/4 animate-fade-in-up";
            stepEl.style.animationDelay = `${index * 200}ms`;
            stepEl.innerHTML = `<div class="bg-white p-6 rounded-full mb-6 shadow-md">${step.icon}</div><h3 class="text-2xl font-bold mb-3 text-brand-dark">${step.title}</h3><p class="text-brand-gray">${step.description}</p>`;
            processContainer.appendChild(stepEl);
            if (index < steps.length - 1) {
                const arrowEl = document.createElement('div');
                arrowEl.className = "hidden md:flex items-center justify-center w-auto";
                arrowEl.innerHTML = `<svg class="w-12 h-12 text-brand-orange opacity-30" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>`;
                processContainer.appendChild(arrowEl);
            }
        });
    }

    // --- Helper: Show Loading Spinner ---
    const showLoadingSpinner = (container, message) => {
        container.innerHTML = `<div class="flex flex-col items-center justify-center py-8"><svg class="animate-spin h-12 w-12 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p class="mt-4 text-brand-gray">${message}</p></div>`;
    };

    // --- SCRAP IDENTIFIER ---
    const identifierFileInput = document.getElementById('waste-upload-input');
    const identifierImagePreview = document.getElementById('waste-image-preview');
    const identifierResultArea = document.getElementById('identifier-result-area');
    let imageBase64 = null;
    let imageMimeType = null;

    const handleIdentifyClick = async () => {
        if (!imageBase64) return;
        showLoadingSpinner(identifierResultArea, 'Analyzing photo...');
        try {
            const jsonResponse = await identifyScrap(imageBase64, imageMimeType);
            const result = JSON.parse(jsonResponse);
            let resultHTML = `<div class="text-left">
                <div class="text-center">
                    <p class="text-brand-gray mb-1">Identified Item:</p>
                    <h3 class="text-3xl font-bold text-brand-dark mb-2">${result.itemName}</h3>
                    <p class="text-brand-gray mb-1">Category:</p>
                    <p class="text-lg text-brand-green mb-4 font-semibold">${result.category}</p>
                </div>`;
            if (result.recyclable) {
                resultHTML += `<div class="mt-6 pt-4 border-t border-gray-300 text-center">
                    <h4 class="text-xl font-bold text-brand-dark mb-2">Estimated Value</h4>
                    <p class="font-bold text-3xl text-brand-orange">${result.estimatedPrice}</p>
                    <p class="text-xs text-brand-gray mt-2">(Final price may vary based on quality & location)</p>
                </div>
                <div class="text-center mt-8">
                  <button data-scroll-to="#contact" class="bg-brand-green hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-full transition-colors">
                     Schedule Pickup
                  </button>
                </div>`;
            } else {
                resultHTML += `<div class="mt-6 pt-4 border-t border-gray-300 text-center"><p class="text-brand-gray">This item is not typically accepted for scrap recycling. Please contact us for options.</p></div>`;
            }
            resultHTML += `</div>`;
            identifierResultArea.innerHTML = resultHTML;
            document.querySelectorAll('[data-scroll-to]').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.querySelector(this.dataset.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
                });
            });
        } catch (error) {
            identifierResultArea.innerHTML = `<div class="text-center py-4"><p class="text-red-600">Error: ${error.message}</p><button onclick="location.reload()" class="mt-4 text-brand-green underline">Try Again</button></div>`;
        }
    };

    identifierFileInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Data = e.target.result;
                const mimeType = file.type;
                imageMimeType = mimeType;
                imageBase64 = base64Data.split(',')[1];
                identifierImagePreview.src = base64Data;
                identifierImagePreview.classList.remove('hidden');
                document.getElementById('waste-upload-label')?.classList.add('hidden');
                identifierResultArea.innerHTML = `<button id="analyze-button" class="bg-brand-orange hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-full transition-colors w-full">Identify Scrap</button>`;
                document.getElementById('analyze-button')?.addEventListener('click', handleIdentifyClick);
            };
            reader.readAsDataURL(file);
        }
    });

    // --- VALUE CALCULATOR ---
    const valueCalculatorForm = document.getElementById('value-calculator-form');
    const calculatorResultsDiv = document.getElementById('calculator-results');

    valueCalculatorForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const scrapType = document.getElementById('scrap-type-calculator').value;
        const weight = parseFloat(document.getElementById('scrap-weight-calculator').value);
        const unit = document.getElementById('scrap-unit-calculator').value;

        if (!scrapType || !weight || !unit) {
            calculatorResultsDiv.innerHTML = `<p class="text-red-600 text-center">Please fill in all fields.</p>`;
            return;
        }

        showLoadingSpinner(calculatorResultsDiv, 'Calculating...');
        
        try {
            const jsonResponse = await calculateValue(scrapType, weight, unit);
            const result = JSON.parse(jsonResponse);
            calculatorResultsDiv.innerHTML = `
                <div class="bg-brand-light-gray p-6 rounded-lg">
                    <div class="text-center mb-4">
                        <p class="text-brand-gray mb-1">Estimated Value:</p>
                        <p class="text-4xl font-bold text-brand-green">${result.estimatedValue}</p>
                    </div>
                    <div class="mt-6 pt-4 border-t border-gray-200 text-center">
                        <p class="text-brand-gray mb-1">${result.environmentalImpact.metric}:</p>
                        <p class="text-2xl font-semibold text-brand-orange">${result.environmentalImpact.value}</p>
                    </div>
                    <p class="text-xs text-brand-gray mt-4 text-center">${result.disclaimer}</p>
                    <div class="mt-8 text-center">
                        <button data-scroll-to="#contact" class="bg-brand-green hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-full transition-colors">
                            Schedule Pickup Now
                        </button>
                    </div>
                </div>
            `;
            document.querySelectorAll('[data-scroll-to]').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.querySelector(this.dataset.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
                });
            });
        } catch (error) {
            calculatorResultsDiv.innerHTML = `<p class="text-red-600 text-center">Error: ${error.message}</p>`;
        }
    });

    // --- CONTACT FORM ---
    const contactForm = document.getElementById('contact-form');
    const contactButton = document.getElementById('contact-submit-button');
    const contactError = document.getElementById('contact-form-error');

    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        contactButton.disabled = true;
        contactButton.textContent = 'Connecting...';
        contactError.classList.add('hidden');

        try {
            const responseMessage = await generateContactResponse(name);
            contactForm.reset();
            document.getElementById('contact-form-container').innerHTML = `
                <div class="text-center py-12">
                    <svg class="w-20 h-20 mx-auto text-brand-green mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h3 class="text-3xl font-bold text-white mb-4">Success!</h3>
                    <p class="text-brand-light text-lg mb-8">${responseMessage}</p>
                    <button onclick="location.reload()" class="bg-brand-green hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-full transition-colors">Submit Another Request</button>
                </div>
            `;
        } catch (error) {
            contactError.textContent = 'Something went wrong. Please try again.';
            contactError.classList.remove('hidden');
            contactButton.disabled = false;
            contactButton.textContent = 'Find My Kabaadiwala';
        }
    });

    // --- CHATBOT ---
    const chatbotToggleButton = document.getElementById('chatbot-toggle-button');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotCloseButton = document.getElementById('chatbot-close-button');
    const chatbotMessagesDiv = document.getElementById('chatbot-messages');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSubmitButton = document.getElementById('chatbot-submit-button');

    const toggleChatbot = () => {
        chatbotWindow.classList.toggle('hidden');
        chatbotWindow.classList.toggle('flex');
        if (!chatbotWindow.classList.contains('hidden') && chatbotMessagesDiv.children.length === 0) {
            appendMessage('assistant', 'Hi! I\'m your Kabaadi Assistant. Ask me about scrap prices, what we buy, or how our process works!');
        }
    };

    const appendMessage = (role, text) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'}`;
        messageDiv.innerHTML = `<div class="max-w-xs p-3 rounded-lg ${role === 'user' ? 'bg-brand-green text-white' : 'bg-brand-light-gray text-brand-dark'}">${text}</div>`;
        chatbotMessagesDiv.appendChild(messageDiv);
        chatbotMessagesDiv.scrollTop = chatbotMessagesDiv.scrollHeight;
    };

    chatbotToggleButton?.addEventListener('click', toggleChatbot);
    chatbotCloseButton?.addEventListener('click', toggleChatbot);

    chatbotForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = chatbotInput.value.trim();
        if (!userMessage) return;
        appendMessage('user', userMessage);
        chatbotInput.value = '';
        chatbotSubmitButton.disabled = true;

        try {
            const botResponse = await sendChatMessage(userMessage);
            appendMessage('assistant', botResponse);
        } catch (error) {
            appendMessage('assistant', 'Sorry, I encountered an error. Please try again.');
        } finally {
            chatbotSubmitButton.disabled = false;
        }
    });
});
