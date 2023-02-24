
import '../sass/project.scss';
import $ from 'jquery';


$(document).ready(function() {
    const article = (() => ({
        $input: $('#input-0'),
        $button: $('#button-0'),
        $edit: $('.edit'),
        $delete: $('.delete'),
        $like: $('.like'),
        $dislike: $('.dislike'),
        $comments: $('#comments'),
        $reply: $('.reply'),
        user: localStorage.getItem('user'),
        avatarName: 'AA',
        cookies: {},

        getComment(text, level=1, likes=0, dislikes=0, name=this.user, avatar=this.avatarName) {
            return `<div class="mb-3 comment row level-${level}" data-level="${level}">
                <div class="col-1 avatar">${avatar}</div>
                <div class="col-10 title-row">
                    <div class="d-flex justify-content-between">
                        <p class="m-0 p-0 name">${name}</p>
                        <div class="dropdown">
                            <img class="ellipse" src="/static/images/ellipsis.svg" id="dropdownMenuButton2" data-bs-toggle="dropdown">
                            <ul class="dropdown-menu dropdown-menu" aria-labelledby="dropdownMenuButton2">
                            <li class="dropdown-item edit">Edit</li>
                            <li class="dropdown-item delete">Delete</li>
                            </ul>
                        </div>
                    </div>
                    <p class="m-0 p-0 text">
                        ${text}
                    </p>
                    <div class="d-flex">
                        <div>
                            <span class="thumbs like"></span>
                            <span class="likes text">${likes}</span>
                        </div>
                        <div class="mx-3">
                            <span class="thumbs dislike"></span>
                            <span class="dislikes text">${dislikes}</span>
                        </div>
                        ${level <=1? '<span class="reply">reply</span>': ''}
                    </div>
                </div>
            </div>`;
        },

        getAvatar(name) {
            return name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase()
        },

        updateEvents () {
            this.$edit.off("click");
            this.$delete.off("click");
            this.$edit = $('.edit');
            this.$delete = $('.delete');
            this.$edit.on("click", e => this.editComment(e));
            this.$delete.on("click", e => this.deleteComment(e));

            this.$like.off("click");
            this.$dislike.off("click");
            this.$like = $('.like');
            this.$dislike = $('.dislike');
            this.$like.on("click", e => this.likeComment(e));
            this.$dislike.on("click", e => this.dislikeComment(e));
        },

        addReply (e) {
            if (e.key != 'Enter') return;
            const $input = $(e.target);
            const level =  $input.data('level') || 0;
            const likes =  $input.data('likes') || 0;
            const dislikes =  $input.data('dislikes');
            const value = $input.val();
            if (!value) return;
            const section = $(e.target).parent().parent();
            $(e.target).remove();
            if (likes || dislikes) {
                section.replaceWith(this.getComment(value, level, likes, dislikes));
            } else {
                section.replaceWith(this.getComment(value, level));
            }
            this.updateEvents();
        },

        addCommentSection(e) {
            const $commentDiv = $(e.target).parent().parent().parent();
            const $parent = $commentDiv.parent();
            const level = Number($commentDiv.data('level'));
            if ($commentDiv.parent().find('input').length && level != 0) return;
            if ($commentDiv.parent().find('input[data-level=1]').length && level == 0) return;
            const replyTo = $commentDiv.data('comment');
            const inputId  = `input-${replyTo}-${level}-${Math.ceil(Math.random() * 10000)}`;
            const replySection = `<div class="replies"><div class="section-level">
                <div class="mb-3 row level-${level + 1} w-75">
                    <div class="col-1 avatar">${this.avatarName}</div>
                    <div class="col-10">
                        <input type="text" class="form-control" data-level="${level + 1}"
                            data-reply-to="${replyTo}" id="${inputId}" class="input">
                    </div>
                </div>
            </div></div>`;
            if ($parent.hasClass('main-section')) {
                $parent.append(replySection);
            } else if ($parent.hasClass('section-level')) {
                $parent.append(replySection);
            }
            $(`#${inputId}`).on('keyup', e => this.addReply(e));
        },

        sendMessage($input) {
            const value = $input.val();
            if (!value) return;
            this.$comments.prepend(this.getComment(value, 0));
            $input.val('');
        },

        editComment(e) {
            const $comment = $(e.target).parent().parent().parent().parent().parent();
            const level = Number($comment.data('level'));
            const comment = Number($comment.data('comment'));
            const inputId  = `input-edit-${comment}-${level}-${Math.ceil(Math.random() * 10000)}`;
            const text = $comment.find('.text').first().text().trim();
            const likes = $comment.find('.likes').text().trim();
            const dislikes = $comment.find('.dislikes').text().trim();
            console.log(likes, dislikes)
            $comment.replaceWith(`<div class="mb-3 row level-${level} w-75">
                <div class="col-1 avatar">${this.avatarName}</div>
                <div class="col-10">
                    <input type="text" class="form-control" data-level="${level}" data-comment="${comment}"
                        data-likes="${likes}" data-dislikes="${dislikes}" id="${inputId}" class="input" value="${text}">
                </div>
            </div>`);
            $(`#${inputId}`).on('keyup', e => this.addReply(e));
        },

        deleteComment(e) {
            const $comment = $(e.target).parent().parent().parent().parent().parent();
            if ($comment.data('level') == 0 || $comment.data('level') == 2) {
                $comment.remove();
            } else {
                $comment.parent().remove();
            }
            this.sendRequest(`articles/api/comment/delete/${$comment.data('comment')}`, "DELETE")
        },

        likeComment (e) {
            const $impressions = $(e.target).parent().find('.likes');
            const $section = $impressions.parent().parent();
            const commentId = $section.parent().parent().data('comment')
            if ($section.hasClass('disliked')) return;
            if ($section.hasClass('liked')) {
                $impressions.text(Number($impressions.text()) - 1);
                $section.removeClass('liked');
                this.sendRequest(`articles/api/comment/remove-like/${commentId}`, "DELETE")
            } else {
                $impressions.text(Number($impressions.text()) + 1);
                $section.addClass('liked');
                this.sendRequest(`articles/api/comment/like/${commentId}`, "PUT")
            };
        },

        dislikeComment (e) {
            const $impressions = $(e.target).parent().find('.dislikes');
            const $section = $impressions.parent().parent();
            const commentId = $section.parent().parent().data('comment')
            if ($section.hasClass('liked')) return;
            if ($section.hasClass('disliked')) {
                $impressions.text(Number($impressions.text()) - 1);
                $section.removeClass('disliked');
                this.sendRequest(`articles/api/comment/remove-dislike/${commentId}`, "DELETE")
            } else {
                $impressions.text(Number($impressions.text()) + 1);
                $section.addClass('disliked');
                this.sendRequest(`articles/api/comment/dislike/${commentId}`, "PUT")
            };
        },

        addEvents() {
            this.$input.on("keyup", e => {
                if (e.key != 'Enter') return;
                this.sendMessage(this.$input);
            });
            this.$button.on("click", e => {
                this.sendMessage(this.$input);
            });
            this.$reply.on("click", e => this.addCommentSection(e));
            this.$edit.on("click", e => this.editComment(e));
            this.$delete.on("click", e => this.deleteComment(e));
            this.$like.on("click", e => this.likeComment(e));
            this.$dislike.on("click", e => this.dislikeComment(e));
        },

        getCookies() {
            const cookies = document.cookie;
            const cookieArray = cookies.split(";");
            cookieArray.forEach(cookie => {
                const [name, value] = cookie.trim().split("=");
                this.cookies[name] = value;
            });
        },

        sendRequest(url, method, data={}) {
            $.ajax({
                url: 'http://127.0.0.1:8000/' + url,
                type: method,
                headers: {
                    'X-CSRFToken': this.cookies['csrftoken'],
                    'Authorization': `Bearer ${this.accessToken}`
                },
                data: data,
                success: function(response) {
                    return response
                },
                error: function(xhr, status, error) {
                    return error
                }
            });
        },

        getToken() {
            const accessToken  = localStorage.getItem('access_token');
            const user  = localStorage.getItem('user');
            const username  = localStorage.getItem('username');
            if (!username || !user) return;
            if (accessToken && user) return;
            $.ajax({
                url: 'http://127.0.0.1:8000/users/api/login',
                type: 'POST',
                headers: {
                    'X-CSRFToken': this.cookies['csrftoken'],
                },
                data: {
                    username: localStorage.getItem('username'),
                    password: localStorage.getItem('password'),
                },
                success: function(response) {
                    localStorage.setItem('access_token', response.access);
                    localStorage.setItem('refresh_token', response.refresh);
                    localStorage.removeItem('username');
                    localStorage.removeItem('password');
                },
                error: function(xhr, status, error) {
                    console.error("Unable to get Token");
                    if (error) console.error(error)
                }
            });
        },

        setup() {
            this.getCookies();
            this.getToken();
            if (this.user) this.avatarName = this.getAvatar(this.user);
            this.accessToken =  localStorage.getItem('access_token');
        },

        main () {
            this.setup();
            this.addEvents();
            window.$ = $;
        },
    }))();

    article.main();
});
