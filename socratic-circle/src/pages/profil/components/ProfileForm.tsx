import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema } from "../util/formSchema";
import { z } from "zod";
import { useEffect } from "react";
import useGetUserProfile from "../util/getUserProfile";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { ProfileDataType } from "@/types/types";

interface IProfileForm {
  profileDataState: ProfileDataType | null;
}

export function ProfileForm({ profileDataState }: IProfileForm) {
  const { toast } = useToast();

  const { getUserProfile } = useGetUserProfile();

  const initialFormValues = {
    firstName: profileDataState?.firstName,
    lastName: profileDataState?.lastName,
    about: profileDataState?.about,
    degree: profileDataState?.degree,
    school: profileDataState?.school,
    currentCity: profileDataState?.currentCity,
    homeTown: profileDataState?.homeTown,
    email: profileDataState?.email,
    mobile: profileDataState?.mobile,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      about: "",
      degree: "",
      school: "",
      currentCity: "",
      homeTown: "",
      email: "",
      mobile: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const profileData = {
      firstName: values.firstName,
      lastName: values.lastName,
      about: values.about,
      degree: values.degree,
      school: values.school,
      currentCity: values.currentCity,
      homeTown: values.homeTown,
      email: values.email,
      mobile: values.mobile,
    };
    try {
      const profileId = profileDataState?.id || "";
      const profileRef = doc(db, "profiles", profileId);

      await updateDoc(profileRef, profileData);
      toast({
        title: "Your Profile has been Updated successfully",
      });
    } catch (err) {
      console.error(err);
    }
    getUserProfile();
  }

  useEffect(() => {
    form.reset(initialFormValues);
  }, [profileDataState]);

  return (
    <Dialog>
      <DialogTrigger className="self-start">
        <Button>
          <span className="material-symbols-outlined">manage_accounts</span>
          Update
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <fieldset className="flex gap-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Peter" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Dvorský" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Hello, my name is Peter. I am 30 years old..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe your self in few sentences
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <fieldset className="flex gap-2 justify-between">
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Highest Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="Mgr. of Philosophy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>School</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Oxford Univesity, London"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            <fieldset className="flex gap-2">
              <FormField
                control={form.control}
                name="currentCity"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Current City</FormLabel>
                    <FormControl>
                      <Input placeholder="Prague, CZ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="homeTown"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Home Town</FormLabel>
                    <FormControl>
                      <Input placeholder="Nitra, SK" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            <fieldset className="flex gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@email.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+421..." type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
