'use strict';

let isHebrew = false;

document.addEventListener('DOMContentLoaded', function() {
    
    // Function to get the language parameter from the URL
    function getLanguageParam() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('lang');
    }

    // Function to set the language based on the URL parameter
    function setLanguageFromUrl() {
        const langParam = getLanguageParam();
        if (langParam && (langParam === 'he' || langParam === 'en')) {
            isHebrew = langParam === 'he';
            updateLanguageElements();
        }
    }

    // Function to set default values
    function setDefaultValues() {
        const classDropdown = document.getElementById('classDropdown');
        const studentDropdown = document.getElementById('studentDropdown');
        const attendanceStatus = document.getElementById('attendanceStatus');
    
        // Set default values for dropdowns
        classDropdown.value = "";
        attendanceStatus.value = "";
    }
    
    function fetchClasses() {
        return fetch('/get_classes')
            .then(response => response.json())
            .catch(error => {
                console.error('Fetch classes error:', error);
                throw new Error('An error occurred while fetching classes.');
            });
    }

    function fetchStudents(selectedClass) {
        return fetch('/get_students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ selected_class: selectedClass })
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Fetch students error:', error);
            throw new Error('An error occurred while fetching students.');
        });
    }

    function validateAndUpdateAttendance() {
        const selectedClass = document.getElementById('classDropdown').value;
        const selectedStudents = Array.from(document.getElementById('studentDropdown').selectedOptions).map(option => option.value);
        const attendanceStatus = document.getElementById('attendanceStatus').value;

        const messageArea = document.getElementById('messageArea');

        if (!selectedClass || selectedStudents.length === 0 || !attendanceStatus) {
            displayMessage('Please select class, student(s), and attendance status!', 'error', messageArea);
        } else {
            fetch('/update_attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    selected_class: selectedClass,
                    selected_students: selectedStudents,
                    attendance_status: attendanceStatus
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    displayMessage('Attendance updated successfully!', 'success', messageArea);
                } else {
                    displayMessage('Failed to update attendance. Please try again.', 'error', messageArea);
                }
            })
            .catch(error => {
                console.error('Attendance update error:', error);
                displayMessage('An error occurred while updating attendance. Please try again.', 'error', messageArea);
            })
            .finally(() => {
                hideMessage(messageArea, 2000); // Hide the message after a delay
            });
        }
    }

    function hideMessage(messageElement, duration) {
        setTimeout(function() {
            messageElement.classList.add('hidden');
        }, duration);
    }

    function displayMessage(messageKey, messageType, messageArea) {
        const isHebrew = document.querySelector('html').getAttribute('lang') === 'he';
        const translatedMessage = translate(messageKey);

        messageArea.textContent = isHebrew ? translatedMessage : messageKey;
        messageArea.classList.remove('hidden', 'success', 'error');
        messageArea.classList.add(messageType);

        if (messageType === 'success') {
            setTimeout(function () {
                setDefaultValues();
            }, 2000);
        }
    }


    const translations = {
        'Attendance updated successfully!': {
            en: 'Attendance updated successfully!',
            he: 'עדכון נוכחות בוצע בהצלחה!'
        },
        'Failed to update attendance. Please try again.': {
            en: 'Failed to update attendance. Please try again.',
            he: 'נכשל בעדכון הנוכחות. אנא נסה שוב.'
        },
        'An error occurred while updating attendance. Please try again.': {
            en: 'An error occurred while updating attendance. Please try again.',
            he: 'אירעה שגיאה בעת עדכון הנוכחות. אנא נסה שוב.'
        },
        'Please select class, student(s), and attendance status!': {
            en: 'Please select class, student(s), and attendance status!',
            he: 'אנא בחר כיתה, סטודנט(ים) וסטטוס נוכחות!'
        },
        'Language switched to English.': {
            en: 'Language switched to English.',
            he: 'השפה שונתה לעברית.'
        },
        'Switch Language': {
            en: 'Switch Language',
            he: 'החלף שפה'
        },
        'Select Class:': {
            en: 'Select Class:',
            he: 'בחר כיתה:'
        },
        'Select Student:': {
            en: 'Select Student:',
            he: 'בחר סטודנט:'
        },
        'Attendance Status:': {
            en: 'Attendance Status:',
            he: 'סטטוס נוכחות:'
        },
        'Update Attendance': {
            en: 'Update Attendance',
            he: 'עדכן נוכחות'
        },
        'Select a class': {
            en: 'Select a class',
            he: 'בחר כיתה'
        },
        'Select a student': {
            en: 'Select a student',
            he: 'בחר סטודנט'
        },
        'Select attendance status': {
            en: 'Select attendance status',
            he: 'בחר סטטוס נוכחות'
        },
        'An error occurred while fetching classes.': {
            en: 'An error occurred while fetching classes.',
            he: 'אירעה שגיאה במהלך קבלת הכיתות. אנא נסה שוב.'
        },
        'An error occurred while fetching students.': {
            en: 'An error occurred while fetching students.',
            he: 'אירעה שגיאה במהלך קבלת הסטודנטים. אנא נסה שוב.'
        },
        'An error occurred while updating attendance. Please try again.': {
            en: 'An error occurred while updating attendance. Please try again.',
            he: 'אירעה שגיאה בעת עדכון הנוכחות. אנא נסה שוב.'
        },
        'Present': {
            en: 'Present',
            he: 'נוכח'
        },
        'Absent': {
            en: 'Absent',
            he: 'נעדר'
        }
    };

    // Function to translate messages based on the current language
    function translate(messageKey) {
        const currentLanguage = isHebrew ? 'he' : 'en';
        return translations[messageKey] ? translations[messageKey][currentLanguage] || messageKey : messageKey;
    }

    // Function to switch language
    function switchLanguage() {
        isHebrew = !isHebrew; // Toggle language
        updateLanguageElements();

        // Update the URL with the new language parameter
        const newLangParam = isHebrew ? 'he' : 'en';
        const url = new URL(window.location);
        url.searchParams.set('lang', newLangParam);
        window.history.replaceState({}, '', url);
    }

    // Function to update language-specific elements
    function updateLanguageElements() {
        const languageSwitchButton = document.getElementById('languageSwitchButton');
        
        // Update labels based on the current language
        const classDropdownLabel = document.querySelector('label[for="classDropdown"]');
        const studentDropdownLabel = document.querySelector('label[for="studentDropdown"]');
        const attendanceStatusLabel = document.querySelector('label[for="attendanceStatus"]');
        const updateButton = document.getElementById('updateButton');
        // Update default placeholder text inside the dropdowns
        const classDropdown = document.getElementById('classDropdown');
        const studentDropdown = document.getElementById('studentDropdown');
        const attendanceStatusDropdown = document.getElementById('attendanceStatus');

        // Set the direction attribute based on the current language
        const htmlElement = document.querySelector('html');
        htmlElement.setAttribute('lang', isHebrew ? 'he' : 'en');
        htmlElement.setAttribute('dir', isHebrew ? 'rtl' : 'ltr');
        
        // Update button text based on the current language
        languageSwitchButton.textContent = translate('Switch Language');
        classDropdownLabel.textContent = translate('Select Class:');
        studentDropdownLabel.textContent = translate('Select Student:');
        attendanceStatusLabel.textContent = translate('Attendance Status:');
        updateButton.textContent = translate('Update Attendance');
        classDropdown.options[0].text = translate('Select a class');
        studentDropdown.options[0].text = translate('Select a student');
        attendanceStatusDropdown.options[0].text = translate('Select attendance status');

        // Update attendance status options
        const attendanceStatusOptions = ['Present', 'Absent'];
        for (let i = 0; i < attendanceStatusOptions.length; i++) {
            const option = document.createElement('option');
            option.value = attendanceStatusOptions[i];
            option.text = translate(attendanceStatusOptions[i]);
            attendanceStatusDropdown.options[i + 1] = option;
        }

        // Display a message indicating the language switch
        const switchMessage = translate('Language switched to English.');
        displayMessage(switchMessage, 'success', messageArea);
        hideMessage(messageArea, 1500);
    }

    // Call the function to set language on page load
    setLanguageFromUrl();

    // Add event listener to the language switch button
    const languageSwitchButton = document.getElementById('languageSwitchButton');
    languageSwitchButton.addEventListener('click', switchLanguage);

    const updateButton = document.getElementById('updateButton');
    updateButton.addEventListener('click', function() {
        validateAndUpdateAttendance();
    });

    const classDropdown = document.getElementById('classDropdown');
    classDropdown.addEventListener('change', function() {
        const selectedClass = classDropdown.value;
        fetchStudents(selectedClass)
            .then(students => {
                const studentDropdown = document.getElementById('studentDropdown');
                studentDropdown.innerHTML = '';
                students.forEach(studentName => {
                    const option = document.createElement('option');
                    option.textContent = studentName;
                    option.value = studentName;
                    studentDropdown.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Fetch students error:', error);
                const messageArea = document.getElementById('messageArea');
                displayMessage('An error occurred while fetching students. Please try again.', 'error', messageArea);
            });
    });

    fetchClasses()
        .then(classes => {
            const classDropdown = document.getElementById('classDropdown');
            classes.forEach(className => {
                const option = document.createElement('option');
                option.textContent = className;
                option.value = className;
                classDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Fetch classes error:', error);
            const messageArea = document.getElementById('messageArea');
            displayMessage('An error occurred while fetching classes. Please try again.', 'error', messageArea);
        });
    
    setLanguageFromUrl();
});
