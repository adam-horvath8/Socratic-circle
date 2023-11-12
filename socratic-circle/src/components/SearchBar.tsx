import { Card } from "./ui/card";
import { Input } from "./ui/input";

export interface IAppProps {}

export default function SearchBar(props: IAppProps) {
  return (
    <Card>
      <Input type="search"></Input>
    </Card>
  );
}
