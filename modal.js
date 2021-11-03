class FormModal {
    static INPUTS_SELECTOR = 'input, textarea';

    #$modal;
    #$inputs;

    constructor(modalEl, onSave) {
        this.#$modal = this.initPostModal(modalEl, onSave);
        this.#$inputs = $(FormModal.INPUTS_SELECTOR);
    }

    initPostModal(modalEl, onSave) {
        return $(modalEl).dialog({
            autoOpen: false,
            height: 300,
            width: 300,
            modal: true,
            buttons: {
                Save: () => {
                    const data = this.getFormData();

                    onSave(data);
                },
                Cancel: this.close.bind(this),
            },
            close: this.close.bind(this),
        });
    }

    open(data) {
        this.setFormData(data);
        this.#$modal.dialog('open');
    }

    close() {
        this.#$modal.dialog('close');
        this.resetForm();
    }

    setFormData(data) {
        for (const input of this.#$inputs) {
            const inputName = input.name;

            if (inputName in data) {
                input.value = data [inputName];
            }
        }
    }

    getFormData() {
        const res = {};

        for (const input of this.#$inputs) {
            res[input.name] = input.value;
        }

        return res;
    }

    resetForm() {
        this.#$inputs.val('');
    }
}
