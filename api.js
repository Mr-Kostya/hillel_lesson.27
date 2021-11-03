class PostAPI {
    static TOKEN = "d32e74ac29fe26a554911fc03812a1e46df4c667a4c891fe98ad93ff068104c6";
    static URL = "https://gorest.co.in/public/v1/todos";
    static USER_ID = 39;
    static HEADERS = {
        'Accept': 'application/json',
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${this.TOKEN}`,
    };

    static getList() {
        return fetch(this.URL)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error("Data not available");
            })
            .then((data) => data.data);
    }

    static getOne(id) {
        return fetch(`${this.URL}/${id}`)
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
                throw new Error('Can not fetch todo from API');
            })
            .then((data) => data.data);
    }

    static create(todoData) {
        return fetch(`${this.URL}`, {
            method: 'POST',
            headers: this.HEADERS,
            body: JSON.stringify({
                ...todoData,
                user_id: this.USER_ID,
            }),
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }

                throw new Error('Can not execute create todo request on API');
            });
    }

    static update(id, todoData) {
        return fetch(`${this.URL}/${id}`, {
            method: 'PUT',
            headers: this.HEADERS,
            body: JSON.stringify(todoData),
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }

                throw new Error('Can not execute create todo request on API');
            });
    }

    static delete(id) {
        return fetch(`${this.URL}/${id}`, {
            method: "DELETE",
            headers: this.HEADERS
        })
            .then((res) => {
                if (!res.ok || res.status !== 204) {
                    throw new Error("Can not complete the task");
                }
            });
    }

    static isEmpty(value) {
        return (typeof value === 'string' && !value.trim())
            || typeof value === 'undefined'
            || value === null;
    }
}
