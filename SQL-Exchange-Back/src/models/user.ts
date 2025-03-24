interface userModel {
    id: number,
    name: string,
    email: string,
    password: string,
    creation_date: string,
    wallet_id: number | null,
    refreshToken: {type: String}
};

export default userModel;
