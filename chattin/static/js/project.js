
import '../sass/project.scss';
import $ from 'jquery';


$(document).ready(function() {
    const article = (() => ({
        $inputs: $('#input'),
        $comments: $('#comments'),
        $reply: $('.reply'),
        user: localStorage.getItem('user'),
        avatarName: 'AA',

        addMessage(avatar, name, text) {
            this.$comments.prepend(`
                <div class="mb-3 comment row">
                    <div class="col-1 avatar">${avatar}</div>
                    <div class="col-10" style="max-width: 90%;">
                        <p class="m-0 p-0 name">${name}</p>
                        <p class="m-0 p-0 text">
                            ${text}
                        </p>
                        <div class="d-flex">
                            <div>
                                <img class="thumbs" src="/static/images/thumbs-up.svg" alt="">
                                <span class="likes text">0</span>
                            </div>
                            <div class="mx-3">
                                <img class="thumbs" src="/static/images/thumbs-down.svg" alt="">
                                <span class="dislikes text">0</span>
                            </div>
                            <span class="reply">reply</span>
                        </div>
                    </div>
                </div>
            `)
        },

        getAvatar(name) {
            return name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase()
        },

        addCommentSection(e) {
            const $commentDiv = $(e.target).parent().parent().parent();
            const replySection = `<div class="mb-3 row level-${1}">
                <div class="col-1 avatar">${this.avatarName}</div>
                <div class="col-10">
                    <input type="text" class="form-control" data-level="${1}" data-reply-to="${3}" id="input" class="input">
                </div>
            </div>`
            $(replySection).insertAfter($commentDiv);
        },

        addEvents() {
            this.$reply.on("click", e => this.addCommentSection(e))
        },

        setup() {
            if (this.user) {
                this.avatarName = this.getAvatar(this.user);
            }
        },

        main () {
            this.setup();
            this.addEvents();
            window.$ = $;
        },
    }))();

    article.main();
});
