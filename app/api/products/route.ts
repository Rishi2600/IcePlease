import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {username, password} = await req.json()

        console.log(username, password)

        return NextResponse.json({
            username: username,
            password: password
        }, {
            status: 200
        })
    } catch(e) {
        console.log(e)

        return NextResponse.json({
            error: "there was an error processing this http POST request"
        }, {
            status: 404
        })
    }
}

export async function GET() {
    try {
        return NextResponse.json({
            message: "Hi there"
        }, {
            status: 200
        })
    } catch(e) {
        console.log(e)

        return NextResponse.json({
            error: "cannot GET"
        }, {
            status: 404
        })
    }
}