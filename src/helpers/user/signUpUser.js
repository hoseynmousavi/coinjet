import userController from "../../controllers/userController"

function signUpUser({first_name, last_name, telegram_username, telegram_id})
{
    return new Promise(resolve =>
    {
        userController.getUserByTelegramId({telegram_id})
            .then(user =>
            {
                if (user)
                {
                    userController.updateUserByTelegramId({telegram_id, update: {first_name, last_name, telegram_username}})
                        .then(updatedUser => resolve(updatedUser))
                }
                else
                {
                    userController.addUser({first_name, last_name, username: telegram_username, telegram_username, telegram_id})
                        .then(newUser => resolve(newUser))
                }
            })
    })
}

export default signUpUser