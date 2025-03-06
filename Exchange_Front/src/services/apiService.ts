export const fetchGetApi = async (endpoin: string) => {
    try{
        const response = await fetch("http://localhost:3030/api/" + endpoin)
        if(!response.ok){
            throw new Error("Error fetching api");
        }
        return response.json()
    }catch(e){
        console.error(e)
        throw new Error(`${e}`)
    }
}

export const fetchAuthApi = async (endpoin: string, token: string) => {
    try{
        const response = await fetch("http://localhost:3030/api/" + endpoin, {
            method: "GET",
            headers: {
                "Authorization": `${token}`
            }
        })
        if(!response.ok){
            throw new Error("Error fetching api");
        }
        return response.json()
    }catch(e){
        console.error(e)
        throw new Error(`${e}`)
    }
}

export const fetchPostApi = async (endpoin: string, body: object) => {
    try{
        const response = await fetch("http://localhost:3030/api/" + endpoin,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        if(!response.ok){
            throw new Error("Error fetching api");
        }
        return response.json()
    }catch(e){
        console.error(e)
        throw new Error(`${e}`)
    }
}