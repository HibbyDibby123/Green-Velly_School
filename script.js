const SUPABASE_URL =
    "https://ffjhugmvmxrgvzluzqah.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_zP_jHs6H7PcDp2XBFOwtVQ_IvfW_6bt";

const EDGE_FUNCTION_URL =
    SUPABASE_URL +
    "/functions/v1/dynamic-handler";


// =========================================
// SCROLL GLIDE
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const elements =
            document.querySelectorAll(
                ".reveal"
            );

        if (!elements.length) {
            return;
        }

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "show"
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.1
                }
            );

        elements.forEach(
            function (element) {

                observer.observe(
                    element
                );

            }
        );

    }
);


// =========================================
// SUPABASE REQUEST
// =========================================

async function supabaseRequest(
    endpoint,
    options = {}
) {

    const response =
        await fetch(
            SUPABASE_URL +
            "/rest/v1/" +
            endpoint,
            {

                ...options,

                headers: {

                    "apikey":
                        SUPABASE_KEY,

                    "Authorization":
                        "Bearer " +
                        SUPABASE_KEY,

                    "Content-Type":
                        "application/json",

                    ...(options.headers || {})

                }

            }
        );


    const responseText =
        await response.text();


    let data;


    try {

        data =
            JSON.parse(
                responseText
            );

    } catch (error) {

        data =
            responseText;

    }


    if (!response.ok) {

        throw new Error(
            "HTTP " +
            response.status +
            ": " +
            (
                typeof data ===
                "string"
                    ? data
                    : JSON.stringify(data)
            )
        );

    }


    return data;

}


// =========================================
// CHECK STUDENT RESULT
// =========================================

async function checkResult() {

    const nameInput =
        document.getElementById(
            "studentName"
        );

    const rollInput =
        document.getElementById(
            "rollNumber"
        );

    const classInput =
        document.getElementById(
            "className"
        );

    const resultMessage =
        document.getElementById(
            "resultMessage"
        );

    const resultContainer =
        document.getElementById(
            "resultContainer"
        );


    if (
        !nameInput ||
        !rollInput ||
        !classInput
    ) {

        return;

    }


    const name =
        nameInput.value.trim();

    const roll =
        rollInput.value.trim();

    const studentClass =
        classInput.value.trim();


    if (
        !name ||
        !roll ||
        !studentClass
    ) {

        if (resultMessage) {

            resultMessage.textContent =
                "Please enter your name, roll number and class.";

        }

        return;

    }


    if (resultMessage) {

        resultMessage.textContent =
            "Searching...";

    }


    if (resultContainer) {

        resultContainer.innerHTML =
            "Searching...";

    }


    try {

        const encodedName =
            encodeURIComponent(
                name
            );

        const encodedRoll =
            encodeURIComponent(
                roll
            );

        const encodedClass =
            encodeURIComponent(
                studentClass
            );


        const data =
            await supabaseRequest(
                "results?student_name=eq." +
                encodedName +
                "&roll=eq." +
                encodedRoll +
                "&class=eq." +
                encodedClass +
                "&select=*"
            );


        if (
            !data ||
            data.length === 0
        ) {

            if (resultContainer) {

                resultContainer.innerHTML =
                    `
                    <div class="result-error">

                        <h3>
                            Result Not Found
                        </h3>

                        <p>
                            No result was found
                            with the information
                            you entered.
                        </p>

                    </div>
                    `;

            }

            if (resultMessage) {

                resultMessage.textContent =
                    "";

            }

            return;

        }


        const student =
            data[0];


        let resultData =
            student.result;


        if (
            typeof resultData ===
            "string"
        ) {

            try {

                resultData =
                    JSON.parse(
                        resultData
                    );

            } catch (error) {

                resultData = {};

            }

        }


        if (resultContainer) {

            resultContainer.innerHTML =
                `

                <div class="result-success">

                    <h3>
                        ${escapeHTML(
                            student.student_name
                        )}
                    </h3>

                    <p>
                        <strong>Roll:</strong>
                        ${escapeHTML(
                            student.roll
                        )}
                    </p>

                    <p>
                        <strong>Class:</strong>
                        ${escapeHTML(
                            student.class
                        )}
                    </p>

                    <h4>
                        Marks
                    </h4>

                    <p>
                        Bangla:
                        ${resultData.bangla ?? 0}
                    </p>

                    <p>
                        English:
                        ${resultData.english ?? 0}
                    </p>

                    <p>
                        Math:
                        ${resultData.math ?? 0}
                    </p>

                    <p>
                        Science:
                        ${resultData.science ?? 0}
                    </p>

                    <h4>
                        Total:
                        ${resultData.total ?? 0}
                    </h4>

                </div>

                `;

        }


        if (resultMessage) {

            resultMessage.textContent =
                "";

        }


    } catch (error) {

        console.error(
            "RESULT ERROR:",
            error
        );


        if (resultContainer) {

            resultContainer.innerHTML =
                `

                <div class="result-error">

                    <h3>
                        Something went wrong
                    </h3>

                    <p>
                        Please try again.
                    </p>

                </div>

                `;

        }


        if (resultMessage) {

            resultMessage.textContent =
                "";

        }

    }

}


// =========================================
// RESULT FORM
// =========================================

const resultForm =
    document.getElementById(
        "resultForm"
    );


if (resultForm) {

    resultForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            checkResult();

        }
    );

}


// =========================================
// ADMIN LOGIN
// =========================================

const adminLoginForm =
    document.getElementById(
        "adminLoginForm"
    );


if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const passwordInput =
                document.getElementById(
                    "adminPassword"
                );

            const message =
                document.getElementById(
                    "adminMessage"
                );


            const password =
                passwordInput.value.trim();


            if (!password) {

                message.textContent =
                    "Please enter the admin password.";

                return;

            }


            message.textContent =
                "Checking password...";


            try {

                const response =
                    await fetch(
                        EDGE_FUNCTION_URL,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    action:
                                        "login",

                                    password:
                                        password

                                })

                        }
                    );


                const responseText =
                    await response.text();


                let data = {};


                try {

                    data =
                        JSON.parse(
                            responseText
                        );

                } catch (error) {

                    data = {};

                }


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        responseText ||
                        "Login failed."
                    );

                }


                if (!data.success) {

                    throw new Error(
                        data.error ||
                        "Incorrect password."
                    );

                }


                sessionStorage.setItem(
                    "adminPassword",
                    password
                );


                localStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );


                window.location.href =
                    "admin-panel.html?v=999";


            } catch (error) {

                console.error(
                    "ADMIN LOGIN ERROR:",
                    error
                );


                message.textContent =
                    error.message;

            }

        }
    );

}


// =========================================
// ADMIN PANEL SECURITY
// =========================================

if (
    window.location.pathname.endsWith(
        "admin-panel.html"
    )
) {

    const loggedIn =
        localStorage.getItem(
            "adminLoggedIn"
        );

    const adminPassword =
        sessionStorage.getItem(
            "adminPassword"
        );


    if (
        loggedIn !== "true" ||
        !adminPassword
    ) {

        window.location.href =
            "admin.html?v=999";

    }

}


// =========================================
// ADD RESULT
// =========================================

const addResultForm =
    document.getElementById(
        "addResultForm"
    );


if (addResultForm) {

    addResultForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const message =
                document.getElementById(
                    "addResultMessage"
                );

            const adminPassword =
                sessionStorage.getItem(
                    "adminPassword"
                );


            if (!adminPassword) {

                message.textContent =
                    "Please log in again.";

                window.location.href =
                    "admin.html?v=999";

                return;

            }


            const name =
                document.getElementById(
                    "addStudentName"
                ).value.trim();


            const roll =
                document.getElementById(
                    "addRollNumber"
                ).value.trim();


            const studentClass =
                document.getElementById(
                    "addClassName"
                ).value;


            const bangla =
                document.getElementById(
                    "banglaMarks"
                ).value;


            const english =
                document.getElementById(
                    "englishMarks"
                ).value;


            const math =
                document.getElementById(
                    "mathMarks"
                ).value;


            const science =
                document.getElementById(
                    "scienceMarks"
                ).value;


            if (
                !name ||
                !roll ||
                !studentClass ||
                bangla === "" ||
                english === "" ||
                math === "" ||
                science === ""
            ) {

                message.textContent =
                    "Please fill in all fields.";

                return;

            }


            message.textContent =
                "Saving result...";


            try {

                const response =
                    await fetch(
                        EDGE_FUNCTION_URL,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    action:
                                        "add-result",

                                    password:
                                        adminPassword,

                                    name:
                                        name,

                                    roll:
                                        roll,

                                    class:
                                        studentClass,

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


                const responseText =
                    await response.text();


                let data = {};


                try {

                    data =
                        JSON.parse(
                            responseText
                        );

                } catch (error) {

                    data = {};

                }


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        responseText ||
                        "Failed to add result."
                    );

                }


                if (!data.success) {

                    throw new Error(
                        data.error ||
                        "Failed to add result."
                    );

                }


                message.textContent =
                    "Result added successfully!";


                addResultForm.reset();


                displayAdminResults();


            } catch (error) {

                console.error(
                    "ADD RESULT ERROR:",
                    error
                );


                message.textContent =
                    "Error: " +
                    error.message;

            }

        }
    );

}


// =========================================
// DISPLAY ADMIN RESULTS
// =========================================

async function displayAdminResults() {

    const container =
        document.getElementById(
            "adminResults"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "Loading results...";


    try {

        const data =
            await supabaseRequest(
                "results?select=*&order=id.desc"
            );


        if (
            !data ||
            data.length === 0
        ) {

            container.innerHTML =
                "<p>No results found.</p>";

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


        data.forEach(
            function (student) {

                let resultData =
                    student.result;


                if (
                    typeof resultData ===
                    "string"
                ) {

                    try {

                        resultData =
                            JSON.parse(
                                resultData
                            );

                    } catch (error) {

                        resultData = {};

                    }

                }


                tableHTML += `

                    <tr>

                        <td>
                            ${escapeHTML(
                                student.student_name
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                student.roll
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                student.class
                            )}
                        </td>

                        <td>
                            ${resultData.bangla ?? 0}
                        </td>

                        <td>
                            ${resultData.english ?? 0}
                        </td>

                        <td>
                            ${resultData.math ?? 0}
                        </td>

                        <td>
                            ${resultData.science ?? 0}
                        </td>

                        <td>
                            <strong>
                                ${resultData.total ?? 0}
                            </strong>
                        </td>

                        <td>

                            <button
                                type="button"
                                onclick="deleteResult(${student.id})"
                            >
                                Delete
                            </button>

                        </td>

                    </tr>

                `;

            }
        );


        tableHTML += `

                </tbody>

            </table>

        `;


        container.innerHTML =
            tableHTML;


    } catch (error) {

        console.error(
            "DISPLAY RESULTS ERROR:",
            error
        );


        container.innerHTML =
            "<p>Could not load results.</p>";

    }

}


// =========================================
// DELETE RESULT
// =========================================

async function deleteResult(id) {

    const adminPassword =
        sessionStorage.getItem(
            "adminPassword"
        );


    if (!adminPassword) {

        alert(
            "Please log in again."
        );


        window.location.href =
            "admin.html?v=999";


        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this result?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                EDGE_FUNCTION_URL,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            action:
                                "delete-result",

                            password:
                                adminPassword,

                            id:
                                id

                        })

                }
            );


        const responseText =
            await response.text();


        let data = {};


        try {

            data =
                JSON.parse(
                    responseText
                );

        } catch (error) {

            data = {};

        }


        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status +
                ": " +
                (
                    data.error ||
                    responseText ||
                    "Delete failed."
                )
            );

        }


        if (!data.success) {

            throw new Error(
                data.error ||
                "Delete failed."
            );

        }


        alert(
            "Result deleted successfully."
        );


        displayAdminResults();


    } catch (error) {

        console.error(
            "DELETE RESULT ERROR:",
            error
        );


        alert(
            "Delete failed:\n\n" +
            error.message
        );

    }

}


// =========================================
// LOGOUT
// =========================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "adminPassword"
            );


            localStorage.removeItem(
                "adminLoggedIn"
            );


            window.location.href =
                "admin.html?v=999";

        }
    );

}


// =========================================
// LOAD ADMIN RESULTS
// =========================================

if (
    window.location.pathname.endsWith(
        "admin-panel.html"
    )
) {

    displayAdminResults();

}


// =========================================
// ESCAPE HTML
// =========================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
