import { auth, db } from "@/config/firebase";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import ProfileContainer from "@/components/ProfileContainer";
import { ProfileDataType } from "@/types/types";
import { onAuthStateChanged } from "firebase/auth";
import { authPromise } from "@/lib/authPromise";

const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  about: z.string().min(2).max(500),
  degree: z.string().min(2).max(50),
  school: z.string().min(2).max(50),
  currentCity: z.string().min(2).max(50),
  homeTown: z.string().min(2).max(50),
  email: z.string().min(2).max(50),
  mobile: z.string().min(2).max(50),
});

export default function Profil() {
  const [profileDataState, setProfileDataState] =
    useState<ProfileDataType | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();
  const photoURL = auth.currentUser?.photoURL;

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

  const getUserProfile = async () => {
    try {
      await authPromise;

      const q = query(
        collection(db, "profiles"),
        where("userId", "==", auth.currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const usersProfile = {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        } as ProfileDataType;

        console.log(usersProfile);

        setProfileDataState(usersProfile);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  useEffect(() => {
    form.reset(initialFormValues);
  }, [profileDataState]);

  console.log(profileDataState);

  return (
    <div className="flex flex-col items-center lg:px-20">
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
                        <Input placeholder="shadcn" {...field} />
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
                        <Input placeholder="shadcn" {...field} />
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
                      <Textarea placeholder="shadcn" {...field} />
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
                        <Input placeholder="shadcn" {...field} />
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
                        <Input placeholder="shadcn" {...field} />
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
                        <Input placeholder="shadcn" {...field} />
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
                        <Input placeholder="shadcn" {...field} />
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
                        <Input placeholder="shadcn" {...field} />
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
                        <Input placeholder="shadcn" {...field} />
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
      <Avatar className="m-6">
        {photoURL ? (
          <AvatarImage src={photoURL} />
        ) : (
          <AvatarFallback>CN</AvatarFallback>
        )}
      </Avatar>
      <ProfileContainer profileDataState={profileDataState} />
    </div>
  );
}
