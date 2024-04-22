export async function GET(request) {
    const requestElaborated = await request.json();
    
    return Response.json({message: "Source successfully set-up"});
}