async function singledata(param1,param2) {
    try {
        const response = await fetch (`/${param1}`,{
            method: 'POST', // HTTP method
           body: JSON.stringify(param2),
           mode: 'cors'
         });
        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
    
}
async function alldata(param) {
    try {
        const response = await fetch (`/${param}`)
        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
    
}
