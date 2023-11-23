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
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import ProfileContainer from "@/components/ProfileContainer";
import { ProfileDataType } from "@/types/types";
import { authPromise } from "@/lib/authPromise";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  about: z.string().max(500).optional(),
  degree: z.string().max(50).optional(),
  school: z.string().max(50).optional(),
  currentCity: z.string().max(50).optional(),
  homeTown: z.string().max(50).optional(),
  email: z.string().max(50).optional(),
  mobile: z.string().max(50).optional(),
});

export default function Profil() {
  const [profileDataState, setProfileDataState] =
    useState<ProfileDataType | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
      } else {
        setError("Error: Could not get the data");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
    <div className="flex flex-col items-center ">
      {loading ? (
        <div className="flex flex-col items-center gap-5 w-full">
          <Skeleton className="w-[200px] h-[200px] rounded-full" />
          <Skeleton className="w-full h-[200px] " />
          <div className="w-full h-[200px] grid grid-cols-2 gap-6">
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        </div>
      ) : error ? (
        <span className="text-3xl">{error}</span>
      ) : (
        <>
          <Dialog>
            <DialogTrigger className="self-start">
              <Button>
                <span className="material-symbols-outlined">
                  manage_accounts
                </span>
                Update
              </Button>
            </DialogTrigger>
            <DialogContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
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
                            <Input
                              placeholder="Mgr. of Philosophy"
                              {...field}
                            />
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
                            <Input
                              placeholder="+421..."
                              type="tel"
                              {...field}
                            />
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
        </>
      )}
    </div>
  );
}
