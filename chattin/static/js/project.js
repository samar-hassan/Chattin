
import '../sass/project.scss';
import $ from 'jquery';


$(document).ready(function() {
    const article = (() => ({
        $input: $('#input-0'),
        $button: $('#button-0'),
        $comments: $('#comments'),
        $reply: $('.reply'),
        user: localStorage.getItem('user'),
        avatarName: 'AA',

        getComment(text, level=1, name=this.user, avatar=this.avatarName) {
            return `<div class="mb-3 comment row level-${level}" data-level="${level}">
                <div class="col-1 avatar">${avatar}</div>
                <div class="col-10 title-row">
                    <div class="d-flex justify-content-between">
                        <p class="m-0 p-0 name">${name}</p>
                        <div class="dropdown">
                            <img class="ellipse" src="/static/images/ellipsis.svg" id="dropdownMenuButton2" data-bs-toggle="dropdown">
                            <ul class="dropdown-menu dropdown-menu" aria-labelledby="dropdownMenuButton2">
                            <li class="dropdown-item">Edit</li>
                            <li class="dropdown-item">Delete</li>
                            </ul>
                        </div>
                    </div>
                    <p class="m-0 p-0 text">
                        ${text}
                    </p>
                    <div class="d-flex">
                        <div>
                            <img class="thumbs" src="/static/images/thumbs-up.svg">
                            <span class="likes text">0</span>
                        </div>
                        <div class="mx-3">
                            <img class="thumbs" src="/static/images/thumbs-down.svg">
                            <span class="dislikes text">0</span>
                        </div>
                        ${level <=1? '<span class="reply">reply</span>': ''}
                    </div>
                </div>
            </div>`;
        },

        getAvatar(name) {
            return name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase()
        },

        addReply (e) {
            if (e.key != 'Enter') return;
            const $input = $(e.target);
            const level =  $input.data('level');
            const value = $input.val();
            if (!value) return;
            const section = $(e.target).parent().parent();
            $(e.target).remove();
            section.replaceWith(this.getComment(value, level));
        },

        addCommentSection(e) {
            const $commentDiv = $(e.target).parent().parent().parent();
            const level = Number($commentDiv.data('level'));
            const replyTo = $commentDiv.data('comment');
            const inputId  = `input-${replyTo}-${level}-${Math.ceil(Math.random() * 10000)}`;
            const replySection = `<div class="replies"><div class="section-level">
                <div class="mb-3 row level-${level + 1} w-75">
                    <div class="col-1 avatar">${this.avatarName}</div>
                    <div class="col-10">
                        <input type="text" class="form-control" data-level="${level + 1}" data-reply-to="${replyTo}"
                            id="${inputId}" class="input">
                    </div>
                </div>
            </div></div>`;
            const parent = $commentDiv.parent();
            if (parent.hasClass('main-section')) {
                parent.append(replySection);
            } else if (parent.hasClass('section-level')) {
                parent.append(replySection);
            }
            $(`#${inputId}`).on('keyup', e => this.addReply(e));
        },

        sendMessage($input) {
            const value = $input.val();
            if (!value) return;
            this.$comments.prepend(this.getComment(value, 0));
            $input.val('');
        },

        addEvents() {
            this.$input.on("keyup", e => {
                if (e.key != 'Enter') return;
                this.sendMessage(this.$input);
            });
            this.$button.on("click", e => {
                this.sendMessage(this.$input);
            });
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
