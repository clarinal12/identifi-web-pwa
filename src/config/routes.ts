import RequireAuth from '../HOC/RequireAuth';
import LoadableComponent from './LoadableComponent';

const Register = LoadableComponent({ componentPathName: 'pages/Register' });
const PasswordReset = LoadableComponent({ componentPathName: 'pages/PasswordReset' });
const ForgotPassword = LoadableComponent({ componentPathName: 'pages/ForgotPassword' });
const Login = LoadableComponent({ componentPathName: 'pages/Login' });
const InviteSetup = LoadableComponent({ componentPathName: 'pages/InviteSetup' });
const Setup = LoadableComponent({ componentPathName: 'pages/Setup' });

const CheckIns = LoadableComponent({ componentPathName: 'pages/CheckIns' });
const Profile = LoadableComponent({ componentPathName: 'pages/Profile' });
const Members = LoadableComponent({ componentPathName: 'pages/Members' });
const Settings = LoadableComponent({ componentPathName: 'pages/Settings' });
const Links = LoadableComponent({ componentPathName: 'pages/Links' });

Register.preload();
PasswordReset.preload();
ForgotPassword.preload();
Login.preload();
InviteSetup.preload();
Setup.preload();

CheckIns.preload();
Profile.preload();
Members.preload();
Settings.preload();
Links.preload();

const routes = [
  {
    component: RequireAuth(Register, false),
    path: '/register',
  },
  {
    component: RequireAuth(PasswordReset, false),
    path: '/account/password/reset',
  },
  {
    component: RequireAuth(ForgotPassword, false),
    path: '/forgot-password',
  },
  {
    component: RequireAuth(Login, false),
    path: '/login',
  },
  {
    component: RequireAuth(InviteSetup, false),
    path: '/invite/setup',
  },
  {
    component: RequireAuth(Setup),
    path: '/setup',
  },
  {
    component: RequireAuth(CheckIns),
    path: '/checkins',
  },
  {
    component: RequireAuth(Profile),
    path: '/profile',
  },
  {
    component: RequireAuth(Members),
    path: '/members',
  },
  {
    component: RequireAuth(Links),
    path: '/links',
  },
  {
    component: RequireAuth(Settings),
    path: '/settings',
  },
];

export default routes;
