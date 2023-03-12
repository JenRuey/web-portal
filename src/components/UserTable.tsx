import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button/Button";
import Dialog from "@mui/material/Dialog/Dialog";
import DialogActions from "@mui/material/DialogActions/DialogActions";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import { sha256 } from "js-sha256";
import jwt_decode from "jwt-decode";
import moment from "moment";
import * as React from "react";
import { toast } from "react-toastify";
import {
  userAdd,
  userDelete,
  userEdit,
  UserType,
} from "../redux/actions/userActions";
import { useAppDispatch } from "../redux/hook";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof UserType;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "id",
    numeric: true,
    disablePadding: true,
    label: "User ID",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "access_token",
    numeric: false,
    disablePadding: false,
    label: "Access Token",
  },
  {
    id: "modified_datetime",
    numeric: false,
    disablePadding: false,
    label: "Last Modified",
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof UserType
  ) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof UserType) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "center" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

type EnhancedTableType = {
  data: Array<UserType>;
};

type JWTTokenType = {
  sub: string;
  iat: number;
  exp: number;
};

export default function UserTable({ data }: EnhancedTableType) {
  const dispatch = useAppDispatch();

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof UserType>("id");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editProfile, setEditProfile] = React.useState<UserType | null>(null);
  const [addprofile, setAddprofile] = React.useState(false);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof UserType
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleAddClick = () => {
    setEditOpen(true);
    setAddprofile(true);
    setEditProfile({ email: "", hash_key: "" } as UserType);
  };

  const handleClick = (event: React.MouseEvent<unknown>, user: UserType) => {
    setEditOpen(true);
    setAddprofile(false);
    setEditProfile(user);
  };

  const onSave = async () => {
    if (editProfile) {
      if (addprofile) {
        if (
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
            editProfile.hash_key
          )
        ) {
          if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(editProfile.email)) {
            await dispatch(
              userAdd({
                email: editProfile.email,
                hash_key: sha256(editProfile.hash_key),
              } as UserType)
            );
          } else {
            toast("Your email must in valid email format. ", { type: "error" });
            return;
          }
        } else {
          toast(
            "Your password must contain at least 1 upper, 1 lower, 1 number, 1 special character and a minimum of 8 characters in length.",
            { type: "error" }
          );
          return;
        }
      } else {
        let { type } = await dispatch(userEdit(editProfile));
        if (type.includes("rejected")) return;
      }
    }

    setEditOpen(false);
    setEditProfile(null);
    setAddprofile(false);
  };

  const onDelete = async () => {
    try {
      if (editProfile) await dispatch(userDelete(editProfile.id));
    } finally {
      setEditOpen(false);
      setEditProfile(null);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort<UserType>(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      role="checkbox"
                      tabIndex={-1}
                      key={index + " at " + row.id}
                    >
                      <TableCell
                        align={"center"}
                        style={{
                          minWidth: 75,
                          maxWidth: 75,
                          wordWrap: "break-word",
                        }}
                      >
                        {row.id}
                      </TableCell>
                      <TableCell
                        align={"left"}
                        style={{
                          minWidth: 200,
                          maxWidth: 200,
                          wordWrap: "break-word",
                        }}
                      >
                        {row.email}
                      </TableCell>
                      <TableCell
                        align={"left"}
                        style={{
                          minWidth: 100,
                          maxWidth: 100,
                          wordWrap: "break-word",
                        }}
                      >
                        {row.access_token && jwt_decode(row.access_token) ? (
                          <div>
                            <div>
                              {"Subject : " +
                                (jwt_decode(row.access_token) as JWTTokenType)
                                  .sub}
                            </div>
                            <div>
                              {"Expiration : " +
                                moment(
                                  (jwt_decode(row.access_token) as JWTTokenType)
                                    .exp * 1000
                                ).format("D MMM YYYY hh:mm A")}
                            </div>
                            <div>
                              {"Issued At : " +
                                moment(
                                  (jwt_decode(row.access_token) as JWTTokenType)
                                    .iat * 1000
                                ).format("D MMM YYYY hh:mm A")}
                            </div>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell
                        align={"left"}
                        style={{
                          minWidth: 100,
                          maxWidth: 100,
                          wordWrap: "break-word",
                        }}
                      >
                        {moment(row.modified_datetime).format(
                          "D MMM YYYY hh:mm A"
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <div className={"flex-center-between"}>
        <Button onClick={handleAddClick}>{"Add new user"}</Button>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </div>

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {addprofile ? "Add User" : "Modify User"}
        </DialogTitle>
        <DialogContent>
          <FormControl variant="standard" className="w-100 mb-3">
            <InputLabel htmlFor="input-with-icon-adornment">
              Your email
            </InputLabel>
            <Input
              value={editProfile?.email}
              onChange={(e) =>
                setEditProfile((pveditprofile) => {
                  return {
                    ...pveditprofile,
                    email: e.target.value,
                  } as UserType;
                })
              }
              startAdornment={
                <InputAdornment position="start">
                  <EmailIcon htmlColor="lightblue" fontSize="small" />
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl variant="standard" className="w-100 mb-3">
            <InputLabel htmlFor="input-with-icon-adornment">
              Your password
            </InputLabel>
            <Input
              value={editProfile?.hash_key}
              onChange={(e) =>
                setEditProfile((pveditprofile) => {
                  return {
                    ...pveditprofile,
                    hash_key: e.target.value,
                  } as UserType;
                })
              }
              disabled={!addprofile}
              type={"password"}
              startAdornment={
                <InputAdornment position="start">
                  <LockIcon htmlColor="lightblue" fontSize="small" />
                </InputAdornment>
              }
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>{"Discard"}</Button>
          {!addprofile && (
            <Button onClick={onDelete}>{"Remove this user"}</Button>
          )}
          <Button onClick={onSave} autoFocus>
            {"Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
