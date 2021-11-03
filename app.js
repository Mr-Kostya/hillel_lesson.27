const SELECTOR = Object.freeze({
    ADD_BTN: '#addBtn',
    EDIT_BTN: '.edit-btn',
    DELETE_BTN: '.delete-btn',
    MODAL: '#postModal',
    POST_ITEM: '.post-item',
    POST_ITEM_TPL: '#postItemTemplate',
    POST_LIST: '#postListContainer',
});
const NEW_POST = {id: '', title: '', body: ''};

const $postListEl = $(SELECTOR.POST_LIST);
const modal = new FormModal($(SELECTOR.MODAL), savePost);
let posts = [];

$(SELECTOR.ADD_BTN).on('click', onAddBtnClick)
$postListEl
    .on('click', SELECTOR.EDIT_BTN, onEditBtnClick)
    .on('click', SELECTOR.DELETE_BTN, onDeleteBtnClick);

init();

function init() {
    PostAPI.getList()
        .then(setPosts)
        .then(addPostListOnUI);
}

function onAddBtnClick() {
    modal.open(NEW_POST);
}

function onEditBtnClick(e) {
    const id = findPostItemElIndex(e.target);
    const post = findPost(id);

    modal.open(post);
}

function onDeleteBtnClick(e) {
    const id = findPostItemElIndex(e.target);
    const $postEl = findPostItemElByIndex(id);

    posts = posts.filter(post => +post.id !== +id);

    $postEl.remove();
    PostAPI.delete(id);
}

function savePost(post) {
    if (!isValidPost(post)) {
        return alert('Empty field');
    }
    if (post.id) {
        updatePost(post.id, post);
    } else {
        createPost(post);
    }

    modal.close();
}

function createPost(post) {
    PostAPI.create(post).then((newPost) => {
        posts.push(newPost);
        addPostOnUI(newPost);
    })
}

function updatePost(id, data) {
    const post = findPost(id);

    Object.keys(data).forEach(key => post[key] = data[key]);

    updatePostOnUI(id, post);
    PostAPI.update(id, post);
}

function addPostListOnUI(list) {
    list.forEach(addPostOnUI);
}

function addPostOnUI(post) {
    const $postEl = $(genratePostHTML(post));

    $postListEl.append($postEl);
}

function updatePostOnUI(id, post) {
    const $oldPostEl = findPostItemElByIndex(id);
    const $newPostEl = $(genratePostHTML(post));

    $oldPostEl.replaceWith($newPostEl);
}

function genratePostHTML(post) {
    let html = $(SELECTOR.POST_ITEM_TPL).html();

    for (const [key, val] of Object.entries(post)) {
        html = html.replace(`{{${key}}}`, val);
    }

    return html;
}

function findPostItemElByIndex(id) {
    return $postListEl.find(`[data-id='${id}']`)?.closest(SELECTOR.POST_ITEM);
}

function findPostItemElIndex(el) {
    return el.closest(SELECTOR.POST_ITEM)?.dataset?.id;
}

function findPost(id) {
    return posts.find(post => +post.id === +id);
}

function setPosts(list) {
    return posts = list;
}

function isValidPost(post) {
    return !PostAPI.isEmpty(post.title) && !PostAPI.isEmpty(post.body);
}
