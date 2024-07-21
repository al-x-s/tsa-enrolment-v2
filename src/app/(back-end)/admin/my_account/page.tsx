"use client";
import React from "react";
import Link from "next/link";
import getUser from "@/lib/server_actions/getUser";
import {
  enable2fa,
  disable2fa,
  is2faEnabled,
} from "@/lib/server_actions/twoFactorAuthentication";

import qrcode from "qrcode";
import z from "zod";
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

import { useQuery } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  updateUser,
  updateUsername,
} from "@/lib/server_actions/back_end/dbQueries_USER";
import { useToast } from "@/components/ui/use-toast";

// Tanstack
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils/cn";
import { TypedArray } from "oslo";

function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Something went wrong...",
        description: error.message,
      });
    },
  });
}

function UserName({ ...props }) {
  const { toast } = useToast();
  const updateUser = useUpdateUser();
  const { username, id } = props.user;
  const usernameSchema = z.object({
    username: z.string().min(1, "Name must contain at least 1 character"),
  });
  const form = useForm({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: username,
    },
  });

  const { reset, handleSubmit, formState } = form;
  const { isDirty, isSubmitting } = formState;

  const onSubmit = async (formData: z.infer<typeof usernameSchema>) => {
    updateUser.mutate(
      { formData, user_id: id, field: "username" },
      {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: `Username updated`,
          }),
            reset({ username: formData.username });
        },
      }
    );
  };

  return (
    <Card id="user-name" x-chunk="dashboard-04-chunk-1">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>User Name</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full pb-6">
                  <FormControl>
                    <Input className="max-w-[300px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex flex-row justify-between">
            <p className="italic">Update your username</p>
            <div>
              {isDirty && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => reset()}
                >
                  Cancel
                </Button>
              )}

              <Button disabled={!isDirty || isSubmitting} type="submit">
                Update
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function ChangePassword({ ...props }) {
  const updateUser = useUpdateUser();
  const { toast } = useToast();
  const { id } = props.user;
  const passwordSchema = z
    .object({
      current: z.string(),
      new_password: z.string(),
      confirm_password: z.string(),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: "New password and confirmation do not match",
      path: ["new_confirm"],
    });

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const { getFieldState, handleSubmit, reset } = form;

  const onSubmit = (formData: z.infer<typeof passwordSchema>) => {
    updateUser.mutate(
      { formData, user_id: id, field: "password" },
      {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: `Password updated`,
          }),
            reset({ current: "", new_password: "", confirm_password: "" });
        },
      }
    );
  };

  return (
    <>
      <section className="pb-6">
        <h1 className="font-bold pb-6">Change Password</h1>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="current"
              render={({ field }) => (
                <FormItem className="w-full pb-2">
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="max-w-[300px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem className="w-full pb-2">
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="max-w-[300px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => {
                const state = getFieldState("confirm_password");
                return (
                  <FormItem className="w-full pb-4">
                    <FormLabel
                      className={cn(state.error && "text-destructive")}
                    >
                      Confirm New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="max-w-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                );
              }}
            />
            <Button type="submit" className="w-fit">
              Update Password
            </Button>
          </form>
        </Form>
      </section>
    </>
  );
}

function Security({ ...props }) {
  const { username } = props.user;
  const [mfa, setMfa] = React.useState(false);
  const [openEnableMfa, setOpenEnableMfa] = React.useState(false);
  const [openDisableMfa, setOpenDisableMfa] = React.useState(false);

  React.useEffect(() => {
    setMfa(props.mfa);
  });

  const twoFactorAuthToggle = (e: boolean) => {
    if (e === true) {
      setOpenEnableMfa(true);
    } else if (e === false) {
      setOpenDisableMfa(true);
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
          <ChangePassword user={props.user} />
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
        username={username}
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
    async function generateQRCode() {
      const issuer = "TSA-Enrolment-Admin";
      const secret: ArrayBuffer | TypedArray = await new HMAC(
        "SHA-1"
      ).generateKey();
      const uri = createTOTPKeyURI(issuer, props.username, secret!);
      const result: string = await qrcode.toDataURL(uri);
      setQRCODE(result);
      setSecret(secret);
    }

    generateQRCode();
  }, [props.username]);

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
  // Fetch page data
  const { data, isError, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const data = await getUser();
      return data;
    },
  });

  const { data: mfa } = useQuery({
    queryKey: ["isUser2faEnabled"],
    queryFn: async () => {
      const data = await is2faEnabled();
      return data;
    },
  });

  if (isPending || isError) {
    return;
  }

  const { user } = data;

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
          <UserName user={user} />
          <Security user={user} mfa={mfa} />
        </div>
      </div>
    </div>
  );
};
export default MyAccountPage;
