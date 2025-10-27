import {Avatar, Box, Button, Container, CssBaseline, Grid, Link, TextField, Typography} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {useNavigate} from "react-router-dom";
import {FieldValues, useForm} from "react-hook-form";
import {toast} from "react-toastify";
import agent from "../../app/api/agent.ts";
import {LoadingButton} from "@mui/lab";

export default function Register() {
    const navigate = useNavigate();
    const {register, handleSubmit, formState:{isSubmitting, errors, isValid}} = useForm({
        mode: "onTouched"
    });

    async function submitForm(data: FieldValues) {
        try {
            await agent.Account.register(data);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error: any) {
            console.error('Registration error:', error);
            const errorMessage = error?.response?.data || 'Registration failed';
            toast.error(errorMessage);
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        autoFocus
                        {...register('username', {
                            required: "Username is required",
                            minLength: {value: 3, message: "Username must be at least 3 characters"}
                        })}
                        error={!!errors.username}
                        helperText={errors?.username?.message as string}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        {...register('email', {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                        error={!!errors.email}
                        helperText={errors?.email?.message as string}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="First Name"
                        {...register('firstName', {required: "First name is required"})}
                        error={!!errors.firstName}
                        helperText={errors?.firstName?.message as string}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Last Name"
                        {...register('lastName', {required: "Last name is required"})}
                        error={!!errors.lastName}
                        helperText={errors?.lastName?.message as string}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        id="password"
                        {...register('password', {
                            required: "Password is required",
                            minLength: {value: 6, message: "Password must be at least 6 characters"}
                        })}
                        error={!!errors.password}
                        helperText={errors?.password?.message as string}
                    />
                    <LoadingButton
                        loading={isSubmitting}
                        disabled={!isValid}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </LoadingButton>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}