import { useState, useEffect} from "react";
import ProductList from "./ProductList";
import agent from "../../app/api/agent";
import Spinner from "../../app/layout/Spinner";
import {
    Box,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Pagination,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from "@mui/material";
import {Product} from "../../app/model/Product.ts";
import {Brand} from "../../app/model/Brand.ts";
import {Type} from "../../app/model/Type.ts";

const sortOptions = [
    {value: "asc", label: "Ascending"},
    {value: "desc", label: "Descending"}
]

export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [types, setTypes] = useState<Type[]>([]);
    const [selectedSort, setSelectedSort] = useState("asc");
    const [selectedBrand, setSelectedBrand] = useState("All");
    const [selectedType, setSelectedType] = useState("All");
    const [selectedBrandId, setSelectedBrandId] = useState(0);
    const [selectedTypeId, setSelectedTypeId] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        loadProducts(selectedSort);
    }, [currentPage, selectedBrandId, selectedTypeId]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [productsRes, brandsRes, typesRes] = await Promise.all([
                agent.Store.list(currentPage, pageSize),
                agent.Store.brands(),
                agent.Store.types()
            ]);

            console.log('Products loaded:', productsRes);
            console.log('Brands loaded:', brandsRes);
            console.log('Types loaded:', typesRes);

            setProducts(productsRes.content || []);
            setTotalItems(productsRes.totalElements || 0);
            setBrands(brandsRes || []);
            setTypes(typesRes || []);
        } catch (error: any) {
            console.error('Error loading initial data:', error);
            setError(error?.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const loadProducts = async (selectedSort: string, searchKeyword = '') => {
        try {
            setLoading(true);
            setError(null);

            const page = currentPage - 1;
            const size = pageSize;
            const brandId = selectedBrandId !== 0 ? selectedBrandId : undefined;
            const typeId = selectedTypeId !== 0 ? selectedTypeId : undefined;
            const sort = "name";
            const order = selectedSort === "desc" ? "desc" : "asc";

            let url = `products?page=${page}&size=${size}&sort=${sort}&order=${order}`;

            if (brandId !== undefined) {
                url += `&brandId=${brandId}`;
            }
            if (typeId !== undefined) {
                url += `&typeId=${typeId}`;
            }
            if (searchKeyword) {
                url += `&keyword=${encodeURIComponent(searchKeyword)}`;
            }

            console.log('Loading products with URL:', url);

            const productsRes = await agent.Store.list(page + 1, size, brandId, typeId, url);

            console.log('Products response:', productsRes);

            setProducts(productsRes.content || []);
            setTotalItems(productsRes.totalElements || 0);
        } catch (error: any) {
            console.error('Error loading products:', error);
            setError(error?.message || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = (event: any) => {
        const selectedSort = event.target.value;
        setSelectedSort(selectedSort);
        loadProducts(selectedSort);
    };

    const handleBrandChange = (event: any) => {
        const selectedBrand = event.target.value;
        const brand = brands.find((b) => b.name === selectedBrand);
        setSelectedBrand(selectedBrand);
        if (brand) {
            setSelectedBrandId(brand.id);
        } else {
            setSelectedBrandId(0);
        }
    };

    const handleTypeChange = (event: any) => {
        const selectedType = event.target.value;
        const type = types.find((t) => t.name === selectedType);
        setSelectedType(selectedType);
        if (type) {
            setSelectedTypeId(type.id);
        } else {
            setSelectedTypeId(0);
        }
    };

    const handlePageChange = (_event: any, page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = () => {
        setCurrentPage(1);
        loadProducts(selectedSort, searchTerm);
    };

    if (loading) return <Spinner message='Loading Products...' />;

    if (error) {
        return (
            <Box textAlign="center" mt={4}>
                <Typography variant="h5" color="error">
                    Error: {error}
                </Typography>
                <Typography variant="body1" mt={2}>
                    Please make sure all services are running:
                </Typography>
                <Typography variant="body2">
                    - Eureka Server (port 8761)<br />
                    - Product Service (port 8082)<br />
                    - API Gateway (port 8085)
                </Typography>
            </Box>
        );
    }

    if (!products || products.length === 0) {
        return (
            <Box textAlign="center" mt={4}>
                <Typography variant="h5">No products found</Typography>
                <Typography variant="body1" mt={2}>
                    Please add some products to the database
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Box mb={2} textAlign="center">
                    <Typography variant="subtitle1">
                        Displaying {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
                    </Typography>
                </Box>
                {totalItems > pageSize && (
                    <Box mt={4} display="flex" justifyContent="center">
                        <Pagination
                            count={Math.ceil(totalItems / pageSize)}
                            color="primary"
                            onChange={handlePageChange}
                            page={currentPage}
                        />
                    </Box>
                )}
            </Grid>

            <Grid item xs={3}>
                <Paper sx={{mb:2, p: 2}}>
                    <TextField
                        label="Search products"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                </Paper>

                <Paper sx={{ mb: 2, p: 2 }}>
                    <FormControl>
                        <FormLabel id="sort-by-name-label">Sort by Name</FormLabel>
                        <RadioGroup
                            aria-label="sort-by-name"
                            name="sort-by-name"
                            value={selectedSort}
                            onChange={handleSortChange}
                        >
                            {sortOptions.map(({ value, label }) => (
                                <FormControlLabel
                                    key={value}
                                    value={value}
                                    control={<Radio />}
                                    label={label}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Paper>

                <Paper sx={{ mb: 2, p: 2 }}>
                    <FormControl>
                        <FormLabel id="brands-label">Brands</FormLabel>
                        <RadioGroup
                            aria-label="brands"
                            name="brands"
                            value={selectedBrand}
                            onChange={handleBrandChange}
                        >
                            {brands.map((brand) => (
                                <FormControlLabel
                                    key={brand.id}
                                    value={brand.name}
                                    control={<Radio />}
                                    label={brand.name}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Paper>

                <Paper sx={{ mb: 2, p: 2 }}>
                    <FormControl>
                        <FormLabel id="types-label">Types</FormLabel>
                        <RadioGroup
                            aria-label="types"
                            name="types"
                            value={selectedType}
                            onChange={handleTypeChange}
                        >
                            {types.map((type) => (
                                <FormControlLabel
                                    key={type.id}
                                    value={type.name}
                                    control={<Radio />}
                                    label={type.name}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Paper>
            </Grid>

            <Grid item xs={9}>
                <ProductList products={products}/>
            </Grid>

            {totalItems > pageSize && (
                <Grid item xs={12}>
                    <Box mt={4} display="flex" justifyContent="center">
                        <Pagination
                            count={Math.ceil(totalItems / pageSize)}
                            color="primary"
                            onChange={handlePageChange}
                            page={currentPage}
                        />
                    </Box>
                </Grid>
            )}
        </Grid>
    );
}