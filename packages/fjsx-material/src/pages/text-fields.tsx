import { TextField } from "../components/mui/TextField/TextField";

export const TextFieldsPage = props => {
  return (
    <div>
      <TextField
        id="name"
        label="Name"
        margin="normal"
        name="name"
        placeholder="Name..."
        value=""
      />
    </div>
  );
};
