/* =========================================
   GREEN VALLEY SCHOOL
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   SCROLL GLIDE
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const revealElements = document.querySelectorAll(
        ".hero-text, " +
        ".hero-card, " +
        ".section-heading, " +
        ".welcome-grid, " +
        ".info-box, " +
        ".info-item, " +
        ".quick-card, " +
        ".notice-box, " +
        ".result-box, " +
        ".admin-login-box, " +
        ".footer-content > div"
    );

    revealElements.forEach(function (element) {
        element.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                } else {
                    entry.target.classList.remove("show");
                }

            });

        },
        {
            threshold: 0.15
        }
    );

    revealElements.forEach(function (element) {
        revealObserver.observe(element);
    });

});


/* =========================================
   STUDENT RESULT SEARCH
========================================= */

const resultForm = document.getElementById("resultForm");

if (resultForm) {

    resultForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const studentName =
            document.getElementById("studentName").value.trim();

        const rollNumber =
            document.getElementById("rollNumber").value.trim();

        const className =
            document.getElementById("className").value;

        const resultMessage =
            document.getElementById("resultMessage");

        const savedResults =
            JSON.parse(localStorage.getItem("schoolResults")) || [];

        const foundResult = savedResults.find(function (result) {

            return (
                result.name.toLowerCase() === studentName.toLowerCase() &&
                String(result.roll) === rollNumber &&
                String(result.class) === className
            );

        });

        if (foundResult) {

            resultMessage.innerHTML = `
                <div class="result-success">

                    <h3>Result Found</h3>

                    <p>
                        <strong>Name:</strong>
                        ${foundResult.name}
                    </p>

                    <p>
                        <strong>Roll:</strong>
                        ${foundResult.roll}
                    </p>

                    <p>
                        <strong>Class:</strong>
                        ${foundResult.class}
                    </p>

                    <h4>Marks</h4>

                    <p>
                        Bangla:
                        ${foundResult.bangla}
                    </p>

                    <p>
                        English:
                        ${foundResult.english}
                    </p>

                    <p>
                        Mathematics:
                        ${foundResult.math}
                    </p>

                    <p>
                        Science:
                        ${foundResult.science}
                    </p>

                    <p>
                        <strong>Total:</strong>
                        ${foundResult.total} / 400
                    </p>

                </div>
            `;

        } else {

            resultMessage.innerHTML = `
                <div class="result-error">

                    <h3>Result Not Found</h3>

                    <p>
                        Please check the student name,
                        roll number and class.
                    </p>

                </div>
            `;

        }

    });

}


/* =========================================
   ADMIN LOGIN
========================================= */

const adminLoginForm =
    document.getElementById("adminLoginForm");

if (adminLoginForm) {

    adminLoginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const password =
            document.getElementById("adminPassword").value;

        const adminMessage =
            document.getElementById("adminMessage");

        const correctPassword = "admin123";

        if (password === correctPassword) {

            localStorage.setItem(
                "adminLoggedIn",
                "true"
            );

            window.location.href = "admin-panel.html";

        } else {

            adminMessage.innerHTML = `
                <div class="admin-error">
                    Incorrect password. Please try again.
                </div>
            `;

        }

    });

}


/* =========================================
   ADMIN PANEL ACCESS
========================================= */

if (window.location.pathname.includes("admin-panel.html")) {

    const isLoggedIn =
        localStorage.getItem("adminLoggedIn");

    if (isLoggedIn !== "true") {

        window.location.href = "admin.html";

    }

}


/* =========================================
   ADD STUDENT RESULT
========================================= */

const addResultForm =
    document.getElementById("addResultForm");

if (addResultForm) {

    addResultForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("addStudentName").value.trim();

        const roll =
            document.getElementById("addRollNumber").value.trim();

        const className =
            document.getElementById("addClassName").value;

        const bangla =
            Number(document.getElementById("banglaMarks").value);

        const english =
            Number(document.getElementById("englishMarks").value);

        const math =
            Number(document.getElementById("mathMarks").value);

        const science =
            Number(document.getElementById("scienceMarks").value);

        const total =
            bangla +
            english +
            math +
            science;

        const newResult = {
            name: name,
            roll: roll,
            class: className,
            bangla: bangla,
            english: english,
            math: math,
            science: science,
            total: total
        };

        const savedResults =
            JSON.parse(localStorage.getItem("schoolResults")) || [];

        savedResults.push(newResult);

        localStorage.setItem(
            "schoolResults",
            JSON.stringify(savedResults)
        );

        const message =
            document.getElementById("addResultMessage");

        if (message) {

            message.innerHTML = `
                <div class="result-success">
                    Result added successfully.
                </div>
            `;

        }

        addResultForm.reset();

        displayAdminResults();

    });

}


/* =========================================
   DISPLAY ADMIN RESULTS
========================================= */

function displayAdminResults() {

    const adminResults =
        document.getElementById("adminResults");

    if (!adminResults) {
        return;
    }

    const savedResults =
        JSON.parse(localStorage.getItem("schoolResults")) || [];

    if (savedResults.length === 0) {

        adminResults.innerHTML = `
            <p>No results have been added yet.</p>
        `;

        return;
    }

    let tableHTML = `
        <table>

            <thead>
                <tr>
                    <th>Name</th>
                    <th>Roll</th>
                    <th>Class</th>
                    <th>Bangla</th>
                    <th>English</th>
                    <th>Math</th>
                    <th>Science</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
    `;

    savedResults.forEach(function (result, index) {

        tableHTML += `
            <tr>

                <td>${result.name}</td>

                <td>${result.roll}</td>

                <td>${result.class}</td>

                <td>${result.bangla}</td>

                <td>${result.english}</td>

                <td>${result.math}</td>

                <td>${result.science}</td>

                <td>${result.total}</td>

                <td>
                    <button
                        type="button"
                        onclick="deleteResult(${index})"
                    >
                        Delete
                    </button>
                </td>

            </tr>
        `;

    });

    tableHTML += `
            </tbody>

        </table>
    `;

    adminResults.innerHTML = tableHTML;

}


/* =========================================
   DELETE RESULT
========================================= */

function deleteResult(index) {

    const savedResults =
        JSON.parse(localStorage.getItem("schoolResults")) || [];

    if (index < 0 || index >= savedResults.length) {
        return;
    }

    savedResults.splice(index, 1);

    localStorage.setItem(
        "schoolResults",
        JSON.stringify(savedResults)
    );

    displayAdminResults();

}


/* =========================================
   LOAD ADMIN RESULTS
========================================= */

if (document.getElementById("adminResults")) {

    displayAdminResults();

}


/* =========================================
   ADMIN LOGOUT
========================================= */

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", function () {

        localStorage.removeItem("adminLoggedIn");

        window.location.href = "admin.html";

    });

}