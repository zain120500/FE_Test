class response {
    succ() {
        return { status: 200 }
    }
    err(status: number, message: string) {
        return { status: status, message }
    }
}

export default new response();
