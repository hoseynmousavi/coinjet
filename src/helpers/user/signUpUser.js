import userController from "../../controllers/userController"

function signUpUser({telegram_id, first_name, last_name, telegram_username, telegram_chat_id})
{
    return new Promise(resolve =>
    {
        userController.getUserByTelegramId({telegram_id})
            .then(user =>
            {
                if (user)
                {
                    userController.updateUserByTelegramId({telegram_id, update: {telegram_chat_id, first_name: first_name || "", last_name: last_name || "", telegram_username}})
                        .then(updatedUser => resolve(updatedUser))
                }
                else
                {
                    userController.addUser({telegram_id, first_name, last_name, username: telegram_username, telegram_username, telegram_chat_id})
                        .then(newUser => resolve(newUser))
                }
            })
    })
}

export default signUpUser