import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/date-range-picker";

export function RegistryFilters() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="search">Search</Label>
        <Input id="search" placeholder="Search by name or MRN" />
      </div>
      <div>
        <Label htmlFor="disease">Disease</Label>
        <Select>
          <SelectTrigger id="disease">
            <SelectValue placeholder="Select disease" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="covid-19">COVID-19</SelectItem>
            <SelectItem value="influenza">Influenza</SelectItem>
            <SelectItem value="tuberculosis">Tuberculosis</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="not-contacted">Not Contacted</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Date Range</Label>
        <DatePickerWithRange />
      </div>
      <Button className="w-full">Apply Filters</Button>
    </div>
  );
}
