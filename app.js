const DELETE_NOTE = ".delete-note";
const EDIT_NOTE_CONTROL = ".edit-note-control";
const NOTE_TEMPLATE = "#noteTemplate";
const LIST = "#list";
const ADD_NOTE_BTN = "#addNoteBtn";

const ERROR_NOTE_TEXT = 'No empty description'
const ADD_NOTE_TEXT = 'Add note'
const EDIT_NOTE_TEXT = 'Edit note'
let notesList = [];

const noteTemplate = $(NOTE_TEMPLATE).html();
const $noteListEl = $(LIST)
    .on("click", DELETE_NOTE, onDeleteClick)
    .on("click", EDIT_NOTE_CONTROL, onEditClick)

$(ADD_NOTE_BTN).on("click", onAddNoteClick);

init();

function onAddNoteClick() {
    const description = prompt(ADD_NOTE_TEXT)

    if (description === null) {
        return;
    } else if (!description.length) {
        alert(ERROR_NOTE_TEXT)
        return;
    }
    createNote(createNoteData(description));
}

function init() {
    getList();
}

function createNoteData(description) {
    return {
        description
    }
}

function onDeleteClick(e) {
    const $element = $(this);

    $element.fadeOut(1000, () => deleteNote(getElementIndex($element)));
}

function onEditClick() {
    const $element = $(this);

    const description = prompt(EDIT_NOTE_TEXT, $element.text())

    if (description === null) {
        return;
    } else if (!description.length) {
        alert(ERROR_NOTE_TEXT)
        return;
    }

    updateNote(getElementIndex($element), {
        description
    });
}

function setData(data) {
    return (notesList = data);
}

function createNote(note) {
    StickerApi.create(note).then((note) => {
        notesList.push(note);
        renderNote(note);
    });
}

function renderNote(note) {
    const $noteElement = $(getNoteHtml(note));

    $noteListEl.append($noteElement);
}

function updateNote(id, changes) {
    const note = notesList.find((el) => el.id == id);

    Object.keys(changes).forEach((key) => (note[key] = changes[key]));
    StickerApi.update(id, note).then(
        () => updateNoteElement(id, note)
    )
}

function updateNoteElement(id, note) {
    const $element = getNoteElement(id).find(EDIT_NOTE_CONTROL)

    $element && $element.text(note.description)
}

function deleteNote(id) {
    notesList = notesList.filter((el) => el.id != id);

    StickerApi.delete(id).then(() => {
        deleteNoteElement(id);
    })
}

function deleteNoteElement(id) {
    const $element = getNoteElement(id);

    $element && $element.remove();
}

function renderList(notesList) {
    notesList.forEach(renderNote);
}

function getList() {
    StickerApi.getList().then(setData).then(renderList);
}

function getNoteElement(id) {
    return $noteListEl.find(`[data-note-index='${id}']`);
}

function getNoteHtml(note) {
    return noteTemplate
        .replace("{{id}}", note.id)
        .replace("{{description}}", note.description);
}

function getElementIndex($el) {
    const $note = getNoteElementByChild($el);
    return $note && $note.data("noteIndex");
}

function getNoteElementByChild($child) {
    return $child.parent();
}
