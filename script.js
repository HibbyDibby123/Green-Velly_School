/* =========================================
   GREEN VALLEY SCHOOL
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   SUPABASE
========================================= */

const SUPABASE_URL =
    "https://ffjhugmvmxrgvzluzqah.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_zP_jHs6H7PcDp2XBFOwtVQ_IvfW_6bt";

const EDGE_FUNCTION_URL =
    SUPABASE_URL +
    "/functions/v1/dynamic-handler";


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
   SUPABASE REQUEST
========================================= */

async function supabaseRequest(url, options = {}) {

    const response = await fetch(url, {

        ...options,

        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": "Bearer " + SUPABASE_KEY,
            "Content-Type": "application/json",
            ...(options.headers || {})
        }

    });

    if (!response.ok) {

        const errorText = await response.text();

        throw new Error(errorText);

    }

    if (response.status === 204) {
        return null;
    }

    return await response.json();

}


/* =========================================
   STUDENT RESULT SEARCH
========================================= */

const resultForm =
    document.getElementById("resultForm");

if (resultForm) {

    resultForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const studentName =
            document.getElementById("studentName").value.trim();

        const rollNumber =
            document.getElementById("rollNumber").value.trim();

        const className =
            document.getElementById("className").value;

        const resultMessage =
            document.getElementById("resultMessage");

        resultMessage.innerHTML = `
            <div class="result-success">
                Searching result...
            </div>
        `;

        try {

            const url =
                SUPABASE_URL +
                "/rest/v1/results" +
                "?student_name=eq." +
                encodeURIComponent(studentName) +
                "&roll=eq." +
                encodeURIComponent(rollNumber) +
                "&class=eq." +
                encodeURIComponent(className) +
                "&select=*";

            const results =
                await supabaseRequest(url);

            if (results.length === 0) {

                resultMessage.innerHTML = `
                    <div class="result-error">

                        <h3>Result Not Found</h3>

                        <p>
                            Please check the student name,
                            roll number and class.
                        </p>

                    </div>
                `;

                return;
            }

            const foundResult = results[0];

            let marks = {};

            try {

                marks = JSON.parse(foundResult.result);

            } catch (error) {

                marks = {
                    total: foundResult.result
                };

            }

            resultMessage.innerHTML = `
                <div class="result-success">

                    <h3>Result Found</h3>

                    <p>
                        <strong>Name:</strong>
                        ${escapeHTML(foundResult.student_name)}
                    </p>

                    <p>
                        <strong>Roll:</strong>
                        ${escapeHTML(foundResult.roll)}
                    </p>

                    <p>
                        <strong>Class:</strong>
                        ${escapeHTML(foundResult.class)}
                    </p>

                    <h4>Marks</h4>

                    <p>
                        Bangla:
                        ${marks.bangla ?? "-"}
                    </p>

                    <p>
                        English:
                        ${marks.english ?? "-"}
                    </p>

                    <p>
                        Mathematics:
                        ${marks.math ?? "-"}
                    </p>

                    <p>
                        Science:
                        ${marks.science ?? "-"}
                    </p>

                    <p>
                        <strong>Total:</strong>
                        ${marks.total ?? "-"} / 400
                    </p>

                </div>
            `;

        } catch (error) {

            console.error(error);

            resultMessage.innerHTML = `
                <div class="result-error">

                    <h3>Something went wrong</h3>

                    <p>
                        Could not connect to the result database.
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

    adminLoginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const password =
                document
                    .getElementById("adminPassword")
                    .value;

            const adminMessage =
                document.getElementById("adminMessage");


            if (adminMessage) {

                adminMessage.innerHTML = `
                    <div class="admin-success">
                        Checking password...
                    </div>
                `;

            }


            try {

                const response =
                    await fetch(
                        EDGE_FUNCTION_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                action: "login",

                                password: password

                            })

                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.error ||
                        "Incorrect password."
                    );

                }


                /* SAVE LOGIN */

                sessionStorage.setItem(
                    "adminPassword",
                    password
                );

                localStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );


                /* OPEN ADMIN PANEL */

                window.location.href =
                    "admin-panel.html";


            } catch (error) {

                console.error(error);

                if (adminMessage) {

                    adminMessage.innerHTML = `
                        <div class="admin-error">
                            Incorrect password.
                        </div>
                    `;

                }

            }

        }
    );

}
/* =========================================
   ADMIN PANEL ACCESS
========================================= */

if (
    window.location.pathname.includes(
        "admin-panel.html"
    )
) {

    const isLoggedIn =
        localStorage.getItem("adminLoggedIn");

    if (isLoggedIn !== "true") {

        window.location.href =
            "admin.html";

    }

}


/* =========================================
   ADD STUDENT RESULT
   USES EDGE FUNCTION
========================================= */

const addResultForm =
    document.getElementById("addResultForm");

if (addResultForm) {

    addResultForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document
                    .getElementById("addStudentName")
                    .value
                    .trim();

            const roll =
                document
                    .getElementById("addRollNumber")
                    .value
                    .trim();

            const className =
                document
                    .getElementById("addClassName")
                    .value;

            const bangla =
                Number(
                    document
                        .getElementById("banglaMarks")
                        .value
                );

            const english =
                Number(
                    document
                        .getElementById("englishMarks")
                        .value
                );

            const math =
                Number(
                    document
                        .getElementById("mathMarks")
                        .value
                );

            const science =
                Number(
                    document
                        .getElementById("scienceMarks")
                        .value
                );

            const message =
                document.getElementById(
                    "addResultMessage"
                );

            const adminPassword =
                sessionStorage.getItem(
                    "adminPassword"
                );

            if (!adminPassword) {

                if (message) {

                    message.innerHTML = `
                        <div class="result-error">
                            Please log in again.
                        </div>
                    `;

                }

                return;
            }


            if (message) {

                message.innerHTML = `
                    <div class="result-success">
                        Saving result...
                    </div>
                `;

            }


            try {

                const response =
                    await fetch(
                        EDGE_FUNCTION_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                password:
                                    adminPassword,

                                name:
                                    name,

                                roll:
                                    roll,

                                class:
                                    className,

                                bangla:
                                    bangla,

                                english:
                                    english,

                                math:
                                    math,

                                science:
                                    science

                            })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "Failed to save result."
                    );

                }


                if (message) {

                    message.innerHTML = `
                        <div class="result-success">
                            Result added successfully.
                        </div>
                    `;

                }


                addResultForm.reset();

                displayAdminResults();


            } catch (error) {

                console.error(error);

                if (message) {

                    message.innerHTML = `
                        <div class="result-error">

                            Failed to save result.

                            <br><br>

                            ${escapeHTML(
                                error.message
                            )}

                        </div>
                    `;

                }

            }

        }
    );

}


/* =========================================
   DISPLAY ADMIN RESULTS
========================================= */

async function displayAdminResults() {

    const adminResults =
        document.getElementById(
            "adminResults"
        );

    if (!adminResults) {
        return;
    }


    adminResults.innerHTML = `
        <p>Loading results...</p>
    `;


    try {

        const results =
            await supabaseRequest(
                SUPABASE_URL +
                "/rest/v1/results" +
                "?select=*&order=id.asc"
            );


        if (results.length === 0) {

            adminResults.innerHTML = `
                <p>
                    No results have been added yet.
                </p>
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


        results.forEach(function (result) {

            let marks = {};

            try {

                marks =
                    JSON.parse(
                        result.result
                    );

            } catch (error) {

                marks = {};

            }


            tableHTML += `

                <tr>

                    <td>
                        ${escapeHTML(
                            result.student_name
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            result.roll
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            result.class
                        )}
                    </td>

                    <td>
                        ${marks.bangla ?? "-"}
                    </td>

                    <td>
                        ${marks.english ?? "-"}
                    </td>

                    <td>
                        ${marks.math ?? "-"}
                    </td>

                    <td>
                        ${marks.science ?? "-"}
                    </td>

                    <td>
                        ${marks.total ?? "-"}
                    </td>

                    <td>

                        <button
                            type="button"
                            onclick="deleteResult(${result.id})"
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


        adminResults.innerHTML =
            tableHTML;


    } catch (error) {

        console.error(error);

        adminResults.innerHTML = `

            <div class="result-error">

                Could not load results.

            </div>

        `;

    }

}


/* =========================================
   DELETE RESULT
========================================= */

async function deleteResult(id) {

    alert(
        "Delete is not connected to the secure admin function yet."
    );

}


/* =========================================
   LOAD ADMIN RESULTS
========================================= */

if (
    document.getElementById(
        "adminResults"
    )
) {

    displayAdminResults();

}


/* =========================================
   ADMIN LOGOUT
========================================= */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "adminLoggedIn"
            );

            sessionStorage.removeItem(
                "adminPassword"
            );

            window.location.href =
                "admin.html";

        }
    );

}


/* =========================================
   HTML SAFETY
========================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
