export default function ({ $axios, $swal, $cookies, redirect }) {

    let path = "";

    const showModal = (message) => {
        $swal.fire({
            title: "Error",
            text: message,
            icon: "error"
        });
        return Promise.reject(message);
    }

    $axios.onRequest((config) => {
        path = config.url;
        const token = $cookies.get("token");

        $axios.setHeader("Content-Type", "application/json");
        if (token) {
            $axios.setToken(token, "Bearer");
        }
    })

    $axios.onError(error => {
        let message = ""
        const code = parseInt(error.response && error.response.status);
        if (path === "/login") {
            console.log(error.response)
            message = "Incorrect username or password";
            showModal(message);
        } else if (path === "/register") {
            message = "There are some issue, please try again";
            showModal(message);
        } else {
            if (code === 403 || code === 400) {
                message = "Token expire, please try again";
                redirect('/login');
                showModal(message);
            }
        }
        return Promise.reject();
    })

    $axios.onResponse((response) => {
        return Promise.resolve(response);
    })
}