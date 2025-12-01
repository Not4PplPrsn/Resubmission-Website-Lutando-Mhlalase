// Form Validation Script

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const formDataArray = [];

    // Show/hide postal address section
    const sameAddressYes = document.getElementById('sameAddressYes');
    const sameAddressNo = document.getElementById('sameAddressNo');
    const postalAddressSection = document.getElementById('postalAddressSection');

    function togglePostalAddress() {
        if (sameAddressNo && sameAddressNo.checked) {
            postalAddressSection.style.display = 'block';
        } else {
            postalAddressSection.style.display = 'none';
        }
    }

    if (sameAddressYes) sameAddressYes.addEventListener('change', togglePostalAddress);
    if (sameAddressNo) sameAddressNo.addEventListener('change', togglePostalAddress);

    // Show/hide course mode
    const postgrad = document.getElementById('postgrad');
    const undergrad = document.getElementById('undergrad');
    const courseMode = document.getElementById('courseMode');

    function toggleCourseMode() {
        if (postgrad && postgrad.checked) {
            courseMode.style.display = 'block';
        } else {
            courseMode.style.display = 'none';
        }
    }

    if (postgrad) postgrad.addEventListener('change', toggleCourseMode);
    if (undergrad) undergrad.addEventListener('change', toggleCourseMode);

    // Validation functions
    function validateIdNumber(idNumber) {
        return /^\d{8,10}$/.test(idNumber);
    }
    function validateName(name) {
        return /^[A-Za-z\s-]+$/.test(name);
    }
    function validatePostalCode(code) {
        return /^\d{2,3}$/.test(code);
    }
    function validateFileUpload(fileInput) {
        if (!fileInput.files || fileInput.files.length === 0) return false;
        const file = fileInput.files[0];
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        const maxSize = 5 * 1024 * 1024;
        return allowedTypes.includes(file.type) && file.size <= maxSize;
    }

    // Map field IDs to readable labels
    const fieldLabels = {
        fname: "First Name",
        lname: "Last Name",
        mname: "Middle Name",
        idNumber: "ID Number",
        fatherFname: "Father's First Name",
        fatherLname: "Father's Last Name",
        motherFname: "Mother's First Name",
        motherLname: "Mother's Last Name",
        residentialPostcode: "Residential Postcode",
        postalPostcode: "Postal Postcode"
    };

    // Inline error helpers
    function showError(fieldId, message) {
        let field = document.getElementById(fieldId);
        if (!field) return;
        let errorSpan = document.getElementById(fieldId + "Error");
        if (!errorSpan) {
            errorSpan = document.createElement("span");
            errorSpan.id = fieldId + "Error";
            errorSpan.style.color = "red";
            errorSpan.style.fontSize = "0.9em";
            field.parentNode.appendChild(errorSpan);
        }
        errorSpan.textContent = message;
    }
    function clearErrors() {
        document.querySelectorAll("span[id$='Error']").forEach(span => span.textContent = "");
    }

    // Save & Clear button logic (unchanged)
    const saveAndClearBtn = document.getElementById('saveAndClearBtn');
    if (saveAndClearBtn && form) {
        saveAndClearBtn.addEventListener('click', function() {
            const formData = {};
            const fieldIds = ['fname','lname','mname','idNumber','fatherFname','fatherLname','motherFname','motherLname','residentialPostcode','postalPostcode'];
            fieldIds.forEach(id => {
                const field = document.getElementById(id);
                if (field) formData[id] = field.value.trim();
            });
            const fileFields = ['studentIDDoc','studentMatric','motherIDDoc','fatherIDDoc'];
            fileFields.forEach(id => {
                const fileInput = document.getElementById(id);
                formData[id] = (fileInput && fileInput.files.length > 0) ? fileInput.files[0].name : null;
            });
            formDataArray.push(formData);
            console.log('Saved entry:', formData);
            const inputs = form.querySelectorAll('input[type="text"], input[type="number"], input[type="file"]');
            inputs.forEach(input => input.value = '');
            const radios = form.querySelectorAll('input[type="radio"]');
            radios.forEach(radio => radio.checked = false);
            togglePostalAddress();
            toggleCourseMode();
        });
    }

    // Form submission handler
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            let errorMessage = 'Please correct the following errors: \n';
            clearErrors();

            const requiredFields = ['fname','lname','idNumber'];
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && !field.value.trim()) {
                    isValid = false;
                    errorMessage += `${fieldLabels[fieldId]} is required\n`;
                    showError(fieldId, `${fieldLabels[fieldId]} is required`);
                }
            });

            const idNumber = document.getElementById('idNumber');
            if (idNumber && idNumber.value && !validateIdNumber(idNumber.value)) {
                isValid = false;
                errorMessage += 'Invalid ID Number format\n';
                showError('idNumber', 'Invalid ID Number format');
            }

            const nameFields = ['fname','lname','mname','fatherFname','fatherLname','motherFname','motherLname'];
            nameFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && field.value && !validateName(field.value)) {
                    isValid = false;
                    errorMessage += `Invalid ${fieldLabels[fieldId]} format\n`;
                    showError(fieldId, `Invalid ${fieldLabels[fieldId]} format`);
                }
            });

            const postalCodes = ['residentialPostcode'];
            if (sameAddressNo && sameAddressNo.checked) postalCodes.push('postalPostcode');
            postalCodes.forEach(codeId => {
                const code = document.getElementById(codeId);
                if (code && code.value && !validatePostalCode(code.value)) {
                    isValid = false;
                    errorMessage += `Invalid ${fieldLabels[codeId]} format\n`;
                    showError(codeId, `Invalid ${fieldLabels[codeId]} format`);
                }
            });

            const requiredDocs = ['studentIDDoc','studentMatric','motherIDDoc','fatherIDDoc'];
            requiredDocs.forEach(docId => {
                const doc = document.getElementById(docId);
                if (!doc || !validateFileUpload(doc)) {
                    isValid = false;
                    errorMessage += `Invalid or missing ${docId.replace('Doc',' document')}\n`;
                    showError(docId, `Invalid or missing document`);
                }
            });

            if (!undergrad.checked && !postgrad.checked) {
                isValid = false;
                errorMessage += 'Please select a degree type\n';
            }
            if (postgrad.checked && !document.getElementById('partTime').checked && !document.getElementById('fullTime').checked) {
                isValid = false;
                errorMessage += 'Please select course mode for postgraduate study\n';
            }

            if (!isValid) {
                alert('Please correct the following errors:\n' + errorMessage);
            } else {
                form.submit();
            }
        });
    }

    togglePostalAddress();
    toggleCourseMode();
});