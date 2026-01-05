    export const redirectByRole = (role: string, router: any) => {
    if (role === 'owner') {
        router.push('/owner/dashboard')
    } else {
        router.push('/')
    }
    }
