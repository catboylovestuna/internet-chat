// We enclose this in window.onload.
// So we don't have ridiculous errors.
window.onload = function() {
    // Your web app's Firebase configuration

    // For Firebase JS SDK v7.20.0 and later, measurementId is optional

    const firebaseConfig = {
        apiKey: "AIzaSyCqACZGwrMZc1oyQm6dqu2dXE_tavCywuI",
        authDomain: "internet-chat-8999c.firebaseapp.com",
        projectId: "internet-chat-8999c",
        storageBucket: "internet-chat-8999c.appspot.com",
        messagingSenderId: "1026707578717",
        appId: "1:1026707578717:web:9f24a4c250d967635d12b4",
        measurementId: "G-9PS4V4Q0N6"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // This is very IMPORTANT!! We're going to use "db" a lot.
    var db = firebase.database();

    // We're going to use oBjEcT OrIeNtEd PrOgRaMmInG. Lol
    class MEME_CHAT {

        // Home() is used to create the home page
        home() {
            // First clear the body before adding in
            // the join form
            document.body.innerHTML = '';
            this.create_join_form();
        }

        // chat() is used to create the chat page
        chat() {
            this.create_chat();
        }

        // create_join_form() creates the join form
        create_join_form() {
            var parent = this;

            var join_container = document.createElement('div');
            join_container.setAttribute('id', 'join_container');

            var join_inner_container = document.createElement('div');
            join_inner_container.setAttribute('id', 'join_inner_container');

            var join_button_container = document.createElement('div');
            join_button_container.setAttribute('id', 'join_button_container');

            var join_button = document.createElement('button');
            join_button.setAttribute('id', 'join_button');
            join_button.innerHTML = 'Join <i class="fas fa-sign-in-alt"></i>';

            var join_input_container = document.createElement('div');
            join_input_container.setAttribute('id', 'join_input_container');

            var join_input = document.createElement('input');
            join_input.setAttribute('id', 'join_input');
            join_input.setAttribute('maxlength', 15);
            join_input.placeholder = '♡ Type Your Name Here ♡';

            // Every time we type into the join_input
            join_input.onkeyup = function() {

                if (join_input.value.length > 0) {

                    // Make the button light up
                    join_button.classList.add('enabled');

                    // Allow the user to click the button
                    join_button.onclick = function() {

                        // Save the name to local storage
                        parent.save_name(join_input.value);

                        // Remove the join_container
                        join_container.remove();

                        // Create the chat
                        parent.create_chat();
                    };

                } else {

                    // If the input is empty then turn off the join button
                    join_button.classList.remove('enabled');
                }
            };

            // Append everything to the body
            join_button_container.append(join_button);
            join_input_container.append(join_input);
            join_inner_container.append(
                join_input_container,
                join_button_container
            );
            join_container.append(join_inner_container);
            document.body.append(join_container);
        }

        // create_load() creates a loading circle
        // that is used in the chat container
        create_load(container_id) {

            var container = document.getElementById(container_id);

            if (!container) {
                return;
            }

            container.innerHTML = '';

            var loader_container = document.createElement('div');
            loader_container.setAttribute('class', 'loader_container');

            var loader = document.createElement('div');
            loader.setAttribute('class', 'loader');

            loader_container.append(loader);
            container.append(loader_container);
        }

        // create_chat() creates the chat container and stuff
        create_chat() {

            var parent = this;

            var chat_container = document.createElement('div');
            chat_container.setAttribute('id', 'chat_container');

            var chat_inner_container = document.createElement('div');
            chat_inner_container.setAttribute('id', 'chat_inner_container');

            var chat_content_container = document.createElement('div');
            chat_content_container.setAttribute('id', 'chat_content_container');

            var chat_input_container = document.createElement('div');
            chat_input_container.setAttribute('id', 'chat_input_container');

            var chat_input_send = document.createElement('button');
            chat_input_send.setAttribute('id', 'chat_input_send');
            chat_input_send.setAttribute('disabled', true);
            chat_input_send.innerHTML = `<i class="far fa-paper-plane"></i>`;

            var chat_input = document.createElement('input');
            chat_input.setAttribute('id', 'chat_input');
            chat_input.setAttribute('maxlength', 1000);

            // Get the name of the user
            chat_input.placeholder = `${parent.get_name()}. Say something...`;

            chat_input.onkeyup = function() {

                if (chat_input.value.length > 0) {

                    chat_input_send.removeAttribute('disabled');
                    chat_input_send.classList.add('enabled');

                    chat_input_send.onclick = function() {

                        chat_input_send.setAttribute('disabled', true);
                        chat_input_send.classList.remove('enabled');

                        if (chat_input.value.length <= 0) {
                            return;
                        }

                        // Enable the loading circle
                        parent.create_load('chat_content_container');

                        // Send the message
                        parent.send_message(chat_input.value);

                        // Clear the chat input box
                        chat_input.value = '';

                        // Focus on the input
                        chat_input.focus();
                    };

                } else {

                    chat_input_send.classList.remove('enabled');
                }
            };

            // Allow pressing Enter to send messages
            chat_input.onkeydown = function(event) {

                if (
                    event.key === 'Enter' &&
                    chat_input.value.trim().length > 0
                ) {
                    event.preventDefault();
                    chat_input_send.click();
                }
            };

            var chat_logout_container = document.createElement('div');
            chat_logout_container.setAttribute(
                'id',
                'chat_logout_container'
            );

            var chat_logout = document.createElement('button');
            chat_logout.setAttribute('id', 'chat_logout');
            chat_logout.textContent = `${parent.get_name()} • logout`;

            // Logout
            chat_logout.onclick = function() {
                localStorage.clear();
                parent.home();
            };

            chat_logout_container.append(chat_logout);

            chat_input_container.append(
                chat_input,
                chat_input_send
            );

            chat_inner_container.append(
                chat_content_container,
                chat_input_container,
                chat_logout_container
            );

            chat_container.append(chat_inner_container);
            document.body.append(chat_container);

            // Create loading circle
            parent.create_load('chat_content_container');

            // Get chat data from Firebase
            parent.refresh_chat();
        }

        // Save name
        save_name(name) {
            localStorage.setItem('name', name);
        }

        // Sends message / saves the message to Firebase
        send_message(message) {

            var parent = this;

            if (parent.get_name() == null || message == null) {
                return;
            }

            // Get the Firebase database value
            db.ref('chats/').once('value', function(message_object) {

                var index = parseFloat(message_object.numChildren()) + 1;

                db.ref('chats/' + `message_${index}`).set({
                    name: parent.get_name(),
                    message: message,
                    index: index
                })
                .then(function() {

                    // After we send the chat,
                    // refresh to get the new messages
                    parent.refresh_chat();
                });
            });
        }

        // Get name
        get_name() {

            if (localStorage.getItem('name') != null) {
                return localStorage.getItem('name');
            } else {
                this.home();
                return null;
            }
        }

        // Refresh chat
        refresh_chat() {

            var chat_content_container =
                document.getElementById('chat_content_container');

            if (!chat_content_container) {
                return;
            }

            // Get the chats from Firebase
            db.ref('chats/').on('value', function(messages_object) {

                chat_content_container.innerHTML = '';

                // If there are no messages
                if (messages_object.numChildren() == 0) {
                    return;
                }

                // Convert the message object values to an array
                var messages = Object.values(messages_object.val());

                var guide = [];
                var unordered = [];
                var ordered = [];

                for (var i = 0; i < messages.length; i++) {

                    guide.push(i + 1);

                    unordered.push([
                        messages[i],
                        messages[i].index
                    ]);
                }

                // Sort messages by their index
                guide.forEach(function(key) {

                    var found = false;

                    unordered = unordered.filter(function(item) {

                        if (!found && item[1] == key) {

                            ordered.push(item[0]);
                            found = true;

                            return false;

                        } else {

                            return true;
                        }
                    });
                });

                // Display the ordered messages
                ordered.forEach(function(data) {

                    var name = data.name;
                    var message = data.message;

                    var message_container =
                        document.createElement('div');

                    message_container.setAttribute(
                        'class',
                        'message_container'
                    );

                    var message_inner_container =
                        document.createElement('div');

                    message_inner_container.setAttribute(
                        'class',
                        'message_inner_container'
                    );

                    var message_user_container =
                        document.createElement('div');

                    message_user_container.setAttribute(
                        'class',
                        'message_user_container'
                    );

                    var message_user =
                        document.createElement('p');

                    message_user.setAttribute(
                        'class',
                        'message_user'
                    );

                    message_user.textContent = `${name}`;

                    var message_content_container =
                        document.createElement('div');

                    message_content_container.setAttribute(
                        'class',
                        'message_content_container'
                    );

                    var message_content =
                        document.createElement('p');

                    message_content.setAttribute(
                        'class',
                        'message_content'
                    );

                    message_content.textContent = `${message}`;

                    message_user_container.append(message_user);

                    message_content_container.append(
                        message_content
                    );

                    message_inner_container.append(
                        message_user_container,
                        message_content_container
                    );

                    message_container.append(
                        message_inner_container
                    );

                    chat_content_container.append(
                        message_container
                    );
                });

                // Go to the recent message
                chat_content_container.scrollTop =
                    chat_content_container.scrollHeight;
            });
        }
    }

    // Build the app
    var app = new MEME_CHAT();

    // If we have a name stored in localStorage,
    // then use that name. Otherwise go to home.
    if (app.get_name() != null) {
        app.chat();
    }
};