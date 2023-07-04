import React, { useEffect, useState } from "react";
import { RowActions } from "./RowActions";
import { useAppContext } from "../context/appContext";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Toaster } from "./ui/toaster";

import { DataTable } from "./DataTable";
import { RowCheckBox } from "./RowCheckBox";
import { SortableHeader } from "./SortableHeader";
import PageHeader from "./PageHeader";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import { getContacts, deleteContact } from "../services/contacts";
import Loading from "./Loading";

const Contacts = () => {
  const navigate = useNavigate();
  const getAccessToken = useGetAccessToken();
  const queryClient = useQueryClient();
  const { setContact } = useAppContext();

  const {
    data: contacts,
    isLoading: isContactsLoading,
    isFetching: isContactsFetching,
  } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      return getContacts(accessToken);
    },
    refetchOnWindowFocus: false, // it is not necessary to keep refetching
  });

  const { mutate: deleteContactMutation } = useMutation({
    mutationFn: async ({ rowData }) => {
      console.log(rowData);
      const accessToken = await getAccessToken();
      return deleteContact(rowData, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["contacts"], { exact: true });
    },
  });

  const columns = [
    RowCheckBox,
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "firstName",
      header: ({ column }) => (
        <SortableHeader column={column} title="First Name" />
      ),
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      accessorKey: "organisation",
      header: "Organisation",
    },
    RowActions("Contact", deleteContactMutation),
  ];

  // Use isContactsFetching to show loading screen when refetching
  if (isContactsLoading || isContactsFetching)
    return (
      <div className="w-full mx-auto">
        <Loading />
      </div>
    );

  const rowNavigate = (rowId) => navigate(`/contacts/${rowId}`);
  return (
    <>
      <div className="container py-10 mx-auto">
        <PageHeader
          rowType="Contacts"
          handleClick={() => navigate("/add-contact")}
          hasButton={true}
        />
        <DataTable
          columns={columns}
          data={contacts}
          rowType={"contacts"}
          filterColumn={"lastName"}
          rowNavigate={rowNavigate}
          setData={setContact}
        />
      </div>
      <Toaster />
    </>
  );
};

export default Contacts;
