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

export interface ProfileData {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  about: string;
  degree: string;
  school: string;
  currentCity: string;
  homeTown: string;
  email: string;
  mobile: string;
}

export interface IProfilProps {}

export default function Profil(props: IProfilProps) {
  const [profileDataState, setProfileDataState] = useState<ProfileData | null>(
    null
  );

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
      const q = query(
        collection(db, "profiles"),
        where("userId", "==", auth.currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Assuming there is only one document for each user
        const usersProfile: ProfileData = {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        };

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
    if (auth.currentUser === null) {
      navigate("/home");
    }
  }, [profileDataState]);

  console.log(profileDataState);

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button>Update Profile</Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <fieldset className="flex">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
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
              <fieldset className="flex">
                <FormField
                  control={form.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
                      <FormLabel>School</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </fieldset>

              <fieldset className="flex">
                <FormField
                  control={form.control}
                  name="currentCity"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
                      <FormLabel>Home Town</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </fieldset>

              <fieldset className="flex">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
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
      <Avatar>
        {photoURL ? (
          <AvatarImage src={photoURL} />
        ) : (
          <AvatarFallback>CN</AvatarFallback>
        )}
      </Avatar>
      <span>{auth.currentUser?.displayName}</span>
      <span>{profileDataState?.firstName}</span>
      <span>{profileDataState?.lastName}</span>
      <span>{profileDataState?.about}</span>
      <span>{profileDataState?.school}</span>
      <span>{profileDataState?.currentCity}</span>
      <span>{profileDataState?.homeTown}</span>
      <span>{profileDataState?.email}</span>
      <span>{profileDataState?.mobile}</span>
    </div>
  );
}
