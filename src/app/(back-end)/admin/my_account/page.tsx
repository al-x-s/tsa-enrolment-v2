"use client";
import React from "react";
import Link from "next/link";
import getUser from "@/lib/server_actions/getUser";
import {
  enable2fa,
  disable2fa,
  is2faEnabled,
} from "@/lib/server_actions/twoFactorAuthentication";
import type { Session, User } from "lucia";
import qrcode from "qrcode";
import Image from "next/image";
import { encodeHex } from "oslo/encoding";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { createTOTPKeyURI } from "oslo/otp";
import { HMAC } from "oslo/crypto";

function UserName() {
  return (
    <Card id="user-name" x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>User Name</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <Input placeholder="Update your user name here ..." />
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button>Save</Button>
      </CardFooter>
    </Card>
  );
}

function MFA({ ...props }) {
  const [mfa, setMfa] = React.useState(false);
  const [openEnableMfa, setOpenEnableMfa] = React.useState(false);
  const [openDisableMfa, setOpenDisableMfa] = React.useState(false);

  React.useEffect(() => {
    const runOnMount = async () => {
      const isMfaEnabled: any = await is2faEnabled();
      setMfa(isMfaEnabled);
    };
    runOnMount();
  });

  const twoFactorAuthToggle = (e: boolean) => {
    if (e === true) {
      // open set 2fa dialog
      setOpenEnableMfa(true);
      // if mfa is successfully set up
      // setMfa(true);
    } else if (e === false) {
      // open are sure you want to disable 2fa dialog
      setOpenDisableMfa(true);
      // if answer is yes
      // setMfa(false);
    }
  };
  return (
    <>
      <Card id="security" x-chunk="dashboard-04-chunk-2">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Change password or enable two factor authentication.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <section className="pb-6">
            <h1 className="font-bold pb-2">Change Password</h1>
            <form className="flex flex-col gap-4">
              <Input
                placeholder="Current Password"
                type="password"
                className="max-w-80"
              />
              <Input
                placeholder="New Password"
                type="password"
                className="max-w-80"
              />
              <Button type="submit" className="w-fit">
                Confirm New Password
              </Button>
            </form>
          </section>
          <section className="border-t pt-6">
            <h1 className="font-bold pb-2">Two Factor Authentication (2FA)</h1>
            {mfa === false && (
              <p className="py-2 text-red-700">
                2FA is currently disabled. It is strongly recommended that you
                enable two factor authentication
              </p>
            )}
            <div className="self-center flex flex-row gap-2 py-2">
              <p>Enable Two Factor Authentication</p>
              <Switch
                checked={mfa}
                onCheckedChange={(e) => {
                  twoFactorAuthToggle(e);
                }}
                aria-readonly
              />
            </div>
          </section>
        </CardContent>
      </Card>
      <EnableMfaDialog
        openEnableMfa={openEnableMfa}
        setOpenEnableMfa={setOpenEnableMfa}
        setMfa={setMfa}
        username={props.username}
      />
      <DisableMfaDialog
        openDisableMfa={openDisableMfa}
        setOpenDisableMfa={setOpenDisableMfa}
        setMfa={setMfa}
      />
    </>
  );
}

function EnableMfaDialog({ ...props }) {
  const [otpInput, setOTPInput] = React.useState<string>("");
  const [secret, setSecret] = React.useState<ArrayBuffer | undefined>(
    undefined
  );
  const [qrCode, setQRCODE] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const issuer = "TSA-Enrolment-Admin";
    async function generateQRCode() {
      const accountName = await props.username;
      const secret = await new HMAC("SHA-1").generateKey();
      const uri = createTOTPKeyURI(issuer, accountName, secret!);
      const result = await qrcode.toDataURL(uri);
      setQRCODE(result);
      setSecret(secret);
    }
    generateQRCode();
  }, [props?.username]);

  async function validate2fa() {
    // STEP 1 tests that the optcode is validated by the secret
    const hashedSecret = encodeHex(secret!);
    const isValid = await enable2fa(otpInput, hashedSecret);
    // STEP 2 if unsuccessfully, returns error message which is displayed to user (toast notifcation? Or within the dialog?)
    // STEP 3 if successful, secret is HASHED and then saved in user DB
    if (isValid === true) {
      props.setMfa(true);
      props.setOpenEnableMfa(false);
    } else {
      console.log("Error: ", isValid);
    }
  }

  return (
    <Dialog open={props.openEnableMfa} onOpenChange={props.setOpenEnableMfa}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable 2FA</DialogTitle>
          <DialogDescription>
            Scan the QR code with your authenticator app of choice and enter the
            six digit code to enable two factor authentication.
          </DialogDescription>
        </DialogHeader>
        <img src={qrCode} className="max-w-60 items-center mx-auto" />
        <p className="mx-auto">
          Enter the code from your authenticator app below:
        </p>
        <InputOTP
          maxLength={6}
          value={otpInput}
          onChange={(value) => setOTPInput(value)}
        >
          <InputOTPGroup className="mx-auto">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => {
              props.setOpenEnableMfa(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              validate2fa();
            }}
            disabled={otpInput?.length === 6 ? false : true}
          >
            Enable 2FA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DisableMfaDialog({ ...props }) {
  async function handleClick() {
    const isDisabled = await disable2fa();

    if (isDisabled === true) {
      props.setMfa(false);
      props.setOpenDisableMfa(false);
    } else {
      console.log("Unable to disable 2fa");
    }
  }

  return (
    <Dialog open={props.openDisableMfa} onOpenChange={props.setOpenDisableMfa}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disable 2FA</DialogTitle>
          <DialogDescription>
            Are you sure you want to disable 2FA?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit">Cancel</Button>
          <Button
            type="submit"
            onClick={() => {
              handleClick();
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const MyAccountPage = () => {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    async function fetchUser() {
      const { user } = await getUser();
      if (!user) {
        return;
      } else {
        setUser(user);
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">My Account</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <Link href="#user-name" className="font-semibold text-primary">
            User Name
          </Link>
          <Link href="#security">Security</Link>
        </nav>
        <div className="grid gap-6">
          <UserName />
          <MFA username={user?.username} />
        </div>
      </div>
    </div>
  );
};
export default MyAccountPage;
