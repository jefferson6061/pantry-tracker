"use client"; // Add this line at the top of the file

import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, Button, Modal, TextField } from "@mui/material";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDocs, query, setDoc, deleteDoc, getDoc} from "firebase/firestore";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQog3ZnikBJpRZ-Rrn-ZatskOpNLEHZVc",
  authDomain: "prantry-tracker.firebaseapp.com",
  projectId: "prantry-tracker",
  storageBucket: "prantry-tracker.appspot.com",
  messagingSenderId: "744414064796",
  appId: "1:744414064796:web:12b67dcdd3b699d7613d59",
  measurementId: "G-87SK8123JK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePantry = async () => {
    try {
      const pantryCollection = collection(firestore, 'pantry');
      const snapshot = query(pantryCollection);
      const docs = await getDocs(snapshot);
      const pantryList = [];
      docs.forEach((doc) => {
        pantryList.push({"name": doc.id, ...doc.data()});
      });
      console.log(pantryList);
      setPantry(pantryList);
    } catch (err) {
      console.error("Error fetching pantry items: ", err);
      setError("Failed to fetch pantry items.");
    }
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const normalizedItem = item.toLowerCase();
    const docRef = doc(collection(firestore, 'pantry'), normalizedItem);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const normalizedItem = item.toLowerCase();
    const docRef = doc(collection(firestore, 'pantry'), normalizedItem);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updatePantry();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPantry = pantry.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={'center'}
      flexDirection={"column"}
      alignItems={'center'}
      gap={2}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        paddingY={1}
        paddingX={2}
        bgcolor="white"
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Pantry Item Project
        </Typography>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack direction={'row'} spacing={2}>
            <TextField
              id="outlined"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={async () => {
                await addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box display="flex" flexDirection="column" alignItems="flex-start" gap={2}>
        <Button variant="contained" onClick={handleOpen}>
          Add Item
        </Button>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          margin="normal"
        />
        <Box width="800px" border={'1px solid #333'} >
          <Box width="100%" height="300px" overflow={'auto'}>
            <Stack spacing={2}>
              {error ? (
                <Typography color={'red'}>{error}</Typography>
              ) : (
                filteredPantry.map(({ name, count }) => (
                  <Box
                    key={name}
                    width="100%"
                    height="100px"
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    bgcolor={'#f0f0f0'}
                    padding={3}
                  >
                    <Typography variant={'h5'} color={'#333'} textAlign={'left'}>
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                    <Typography variant={'h5'} color={'#333'} textAlign={'center'}>
                      quantity: {count}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button variant="contained" onClick={() => addItem(name)}>
                        +
                      </Button>
                      <Button variant="contained" onClick={() => removeItem(name)}>
                        -
                      </Button>
                    </Stack>
                  </Box>
                ))
              )}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
